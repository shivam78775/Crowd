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
    const account = algosdk.mnemonicToSecretKey(seed);
    
    // We need to leave some ALGO for the transaction fee (usually 1000 microAlgos)
    // plus the minimum balance requirement (usually 100,000 microAlgos).
    // However, for this simplified version, we assume the escrow has enough.
    
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: account.addr,
      to: toAddress,
      amount: amountMicroAlgos,
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
