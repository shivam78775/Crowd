import algosdk from "algosdk";
import { algodClient } from "./algorand.js";
import Contribution from "../models/Contribution.js";

const MINTING_WALLET_MNEMONIC = process.env.MINTING_WALLET_MNEMONIC;

const BADGE_IMAGES = {
  bronze: "https://emerald-added-pigeon-511.mypinata.cloud/ipfs/QmZ8v7yH9d2mH7mH7mH7mH7mH7mH7mH7mH7mH7mH7mH7m/bronze.png", // Example IPFS URLs
  silver: "https://emerald-added-pigeon-511.mypinata.cloud/ipfs/QmZ8v7yH9d2mH7mH7mH7mH7mH7mH7mH7mH7mH7mH7mH7m/silver.png",
  gold: "https://emerald-added-pigeon-511.mypinata.cloud/ipfs/QmZ8v7yH9d2mH7mH7mH7mH7mH7mH7mH7mH7mH7mH7mH7m/gold.png",
};

export const getTier = (amount) => {
  if (amount >= 50) return "gold";
  if (amount >= 20) return "silver";
  if (amount >= 5) return "bronze";
  return null;
};

export const mintBadgeNFT = async (contributionId) => {
  try {
    if (!MINTING_WALLET_MNEMONIC) {
      console.warn("MINTING_WALLET_MNEMONIC not set. Skipping NFT minting.");
      return;
    }

    const contribution = await Contribution.findById(contributionId).populate("campaignId");
    if (!contribution) return;

    const tier = getTier(contribution.amount);
    if (!tier) return;

    // Check if user already has this tier badge (optional but good for UX)
    // For MVP, we'll just mint a new one per contribution as requested

    contribution.nftStatus = "minting";
    await contribution.save();

    const mintingAccount = algosdk.mnemonicToSecretKey(MINTING_WALLET_MNEMONIC);
    const params = await algodClient.getTransactionParams().do();

    const assetName = `${tier.charAt(0).toUpperCase() + tier.slice(1)} Supporter Badge`;
    const unitName = `FUND-${tier.charAt(0).toUpperCase()}`;
    const metadataURL = BADGE_IMAGES[tier];

    // Create the ASA (NFT)
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: mintingAccount.addr,
      suggestedParams: params,
      total: 1,
      decimals: 0,
      defaultFrozen: false,
      unitName: unitName,
      assetName: assetName,
      manager: mintingAccount.addr,
      reserve: mintingAccount.addr,
      freeze: mintingAccount.addr,
      clawback: mintingAccount.addr,
      assetURL: metadataURL,
    });

    const signedTxn = txn.signTxn(mintingAccount.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    
    const result = await algosdk.waitForConfirmation(algodClient, txId, 4);
    const assetIndex = result["asset-index"];

    console.log(`NFT Minted: Asset ID ${assetIndex}`);

    contribution.nftAssetId = assetIndex;
    contribution.nftStatus = "issued";
    await contribution.save();

    // Note: The donor needs to opt-in to the asset to receive it.
    // In a real Web3 app, we'd prompt them on frontend or use a claim system.
    // For now, we've minted it and recorded it.

    return { assetIndex, txId };
  } catch (error) {
    console.error("NFT Minting Error:", error);
    await Contribution.findByIdAndUpdate(contributionId, { nftStatus: "failed" });
  }
};
