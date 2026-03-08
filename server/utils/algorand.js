import algosdk from "algosdk";

const ALGOD_NODE = "https://testnet-api.algonode.cloud";
const ALGOD_TOKEN = "";
const ALGOD_PORT = "";

export const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_NODE, ALGOD_PORT);

/**
 * Sends ALGO from an escrow account to a recipient.
 * @param {string} seed - The mnemonic (seed phrase) of the escrow account.
 * @param {string} toAddress - recipient address.
 * @param {number} amountMicroAlgos - amount in microAlgos.
 */
export const sendFromEscrow = async (seed, toAddress, amountMicroAlgos) => {
  try {
    const params = await algodClient.getTransactionParams().do();
    
    if (!seed) throw new Error("Mnemonic (seed) is missing");
    const account = algosdk.mnemonicToSecretKey(seed);
    
    if (!account.addr) throw new Error("Escrow address could not be derived from mnemonic");
    if (!toAddress) throw new Error("Recipient address (toAddress) is missing");

    console.log(`[ALGO_SDK]: Sending from ${account.addr} to ${toAddress} | Amount: ${amountMicroAlgos}`);
    
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: account.addr,
      to: toAddress,
      amount: Number(amountMicroAlgos),
      suggestedParams: params,
    });

    const signedTxn = txn.signTxn(account.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    
    await algosdk.waitForConfirmation(algodClient, txId, 4);
    return txId;
  } catch (error) {
    console.error("Algorand Transfer Error:", error);
    throw error;
  }
};
