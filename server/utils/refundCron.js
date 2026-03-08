import cron from "node-cron";
import Campaign from "../models/Campaign.js";
import Contribution from "../models/Contribution.js";
import User from "../models/User.js";
import { sendFromEscrow } from "./algorand.js";

const REFUND_BATCH_SIZE = 10;
const MAX_RETRIES = 3;

/**
 * Automates the refund process for failed campaigns.
 * Enhanced with state management, retries, and high reliability.
 */
export const initRefundCron = () => {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("[REFUND_CRON]: Scanning for expired campaigns...");
    try {
      const now = new Date();
      
      // 1. Identify "failed" campaigns that need processing
      // Condition: status is active AND deadline has passed AND goal not reached
      const campaignsToProcess = await Campaign.find({
        $or: [
          // Newly expired failed campaigns
          { status: "active", deadline: { $lte: now }, $expr: { $lt: ["$raisedAmount", "$goalAmount"] } },
          // Campaigns already marked failed but with pending/partially failed refunds
          { status: "failed", refundStatus: { $in: ["pending", "partial_failure"] } }
        ]
      });

      // 2. Mark successes (status active AND deadline passed AND goal reached)
      const successfulCampaigns = await Campaign.find({
        status: "active",
        deadline: { $lte: now },
        $expr: { $gte: ["$raisedAmount", "$goalAmount"] }
      });

      for (const campaign of successfulCampaigns) {
        campaign.status = "completed";
        await campaign.save();
        await User.findByIdAndUpdate(campaign.creator, {
          $push: {
            notifications: {
              message: `Congratulations! Your campaign "${campaign.title}" successfully reached its goal!`,
              type: "success",
              link: `/campaign/${campaign._id}`,
            },
          },
        });
        console.log(`[REFUND_CRON]: Campaign ${campaign._id} marked as SUCCESS.`);
      }

      // 3. Process Refunds for Failed Campaigns
      for (const campaign of campaignsToProcess) {
        // Atomic lock to prevent concurrent cron runs from processing the same campaign
        const lockedCampaign = await Campaign.findOneAndUpdate(
          { _id: campaign._id, refundStatus: { $ne: "processing" } },
          { $set: { refundStatus: "processing", status: "failed" } },
          { returnDocument: 'after' }
        );

        if (!lockedCampaign) continue;

        console.log(`[REFUND_CRON]: Processing refunds for ${campaign.title} (${campaign._id})...`);

        const totalContribs = await Contribution.countDocuments({ campaignId: campaign._id });
        console.log(`[REFUND_CRON]: Campaign ${campaign._id} has total ${totalContribs} contributions.`);

        // Find all contributions that need a refund
        const contributions = await Contribution.find({
          campaignId: campaign._id,
          $or: [
            { status: { $in: ["funded", "refund_failed"] } },
            { status: { $exists: false } } // Handle legacy records
          ],
          refundRetries: { $lt: MAX_RETRIES }
        }).limit(REFUND_BATCH_SIZE);

        let totalProcessed = 0;
        let totalFailed = 0;

        for (const contribution of contributions) {
          // Double check idempotency
          if (contribution.refundTxId) {
            contribution.status = "refunded";
            await contribution.save();
            continue;
          }

          try {
            if (!campaign.escrowMnemonic) {
              console.error(`[REFUND_CRON]: CRITICAL - Missing escrowMnemonic for campaign ${campaign._id}`);
              continue;
            }

            if (!contribution.contributorWallet) {
              console.error(`[REFUND_CRON]: ERROR - Missing contributorWallet for contribution ${contribution._id}`);
              contribution.status = "refund_failed";
              contribution.refundError = "Missing contributor wallet address";
              await contribution.save();
              totalFailed++;
              continue;
            }

            const amountMicroAlgos = Math.round(contribution.amount * 1_000_000);
            
            // Subtract fee (standard 1000 + 1000 buffer for transaction spikes)
            const refundAmount = amountMicroAlgos - 2000;
            
            if (refundAmount <= 0) {
               console.warn(`[REFUND_CRON]: Skipping tiny refund for ${contribution._id}`);
               contribution.status = "refunded"; // Consider it settled
               await contribution.save();
               continue;
            }

            const txId = await sendFromEscrow(
              campaign.escrowMnemonic,
              contribution.contributorWallet,
              refundAmount
            );

            contribution.status = "refunded";
            contribution.refundTxId = txId;
            contribution.refundError = null;
            await contribution.save();

            // Notify contributor
            await User.findByIdAndUpdate(contribution.contributor, {
              $push: {
                notifications: {
                  message: `Campaign "${campaign.title}" expired. Your refund of ${contribution.amount} ALGO has been processed!`,
                  type: "refund",
                  link: `/campaign/${campaign._id}`,
                },
              },
            });

            totalProcessed++;
          } catch (err) {
            console.error(`[REFUND_CRON]: Refund failed for ${contribution._id}:`, err?.message);
            contribution.status = "refund_failed";
            contribution.refundError = err?.message;
            contribution.refundRetries += 1;
            await contribution.save();
            totalFailed++;
          }
        }

        // Check if all contributions are done
        const remaining = await Contribution.countDocuments({
           campaignId: campaign._id,
           status: { $in: ["funded", "refund_failed"] }
        });

        if (remaining === 0) {
          lockedCampaign.refundStatus = "completed";
          lockedCampaign.raisedAmount = 0; // Reset balance to 0 as requested
          // Notify creator
          await User.findByIdAndUpdate(campaign.creator, {
            $push: {
              notifications: {
                message: `Your campaign "${campaign.title}" failed to reach its goal. All refunds have been processed.`,
                type: "info",
                link: `/campaign/${campaign._id}`,
              },
            },
          });
        } else {
          lockedCampaign.refundStatus = totalFailed > 0 ? "partial_failure" : "pending";
        }
        
        await lockedCampaign.save();
        console.log(`[REFUND_CRON]: Campaign ${campaign._id} summary: ${totalProcessed} done, ${totalFailed} failed.`);
      }

    } catch (error) {
      console.error("[REFUND_CRON]: Global error:", error);
    }
  });
};
