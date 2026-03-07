import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PeraWalletConnect } from "@perawallet/connect";
import algosdk from "algosdk";
import { algodClient } from "../services/algorand";

const WalletContext = createContext(null);

const peraWallet = new PeraWalletConnect({
  chainId: 416002, // TestNet (numeric)
  shouldShowSignTxnToast: true,
});

export const WalletProvider = ({ children }) => {
  const [accountAddress, setAccountAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [connecting, setConnecting] = useState(false);

  // Try to restore existing Pera Wallet session on app load
  useEffect(() => {
    let isMounted = true;

    peraWallet
      .reconnectSession()
      .then((accounts) => {
        if (!isMounted) return;
        if (accounts && accounts.length > 0) {
          setAccountAddress(accounts[0]);
          subscribeToDisconnect();
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log("Pera Wallet reconnection info:", error.message || error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchBalance = async (address) => {
    if (!address) return;
    try {
      const info = await algodClient.accountInformation(address).do();
      // Use Number() to avoid BigInt mixing errors
      const amount = typeof info.amount === "bigint" ? Number(info.amount) : info.amount;
      const newBalance = amount / 1_000_000;
      
      // eslint-disable-next-line no-console
      console.log(`Balance for ${address}: ${newBalance} ALGO`);
      setBalance(newBalance);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching balance:", error);
      setBalance(null);
    }
  };

  const refreshBalance = () => {
    if (accountAddress) {
      fetchBalance(accountAddress);
    }
  };

  useEffect(() => {
    if (accountAddress) {
      fetchBalance(accountAddress);
    } else {
      setBalance(null);
    }
  }, [accountAddress]);

  const subscribeToDisconnect = () => {
    peraWallet.connector?.on("disconnect", () => {
      setAccountAddress(null);
      setBalance(null);
    });
  };

  const connectWallet = async () => {
    if (connecting) return;
    setConnecting(true);
    try {
      const newAccounts = await peraWallet.connect();
      if (newAccounts && newAccounts.length > 0) {
        setAccountAddress(newAccounts[0]);
        subscribeToDisconnect();
      }
    } catch (error) {
      if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
        // eslint-disable-next-line no-console
        console.error("Pera Wallet connection detail:", error);
      }
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await peraWallet.disconnect();
    } catch {
      // ignore
    } finally {
      setAccountAddress(null);
      setBalance(null);
    }
  };

  const sendPayment = async ({ to, amountAlgo }) => {
    if (!accountAddress) {
      throw new Error("Wallet is not connected");
    }

    const sender = accountAddress?.trim();
    const recipient = to?.trim();

    if (!recipient) {
      throw new Error("Destination address is required");
    }

    if (!algosdk.isValidAddress(sender)) {
      throw new Error("Connected wallet address is invalid");
    }

    if (!algosdk.isValidAddress(recipient)) {
      throw new Error("Destination Algorand address is invalid");
    }
    if (!amountAlgo || amountAlgo <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    const suggestedParams = await algodClient.getTransactionParams().do();

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender,
      receiver: recipient,
      amount: Math.round(amountAlgo * 1_000_000),
      suggestedParams,
    });

    // Pera expects an array of transaction groups: SignerTransaction[][]
    const txnGroup = [{ txn, signers: [sender] }];

    // eslint-disable-next-line no-console
    console.log("Requesting signature from Pera Wallet...");
    const signedTxn = await peraWallet.signTransaction([txnGroup]);
    // eslint-disable-next-line no-console
    console.log("Signature received.");

    const signedBytes = signedTxn.map((t) => (t ? new Uint8Array(t) : t));

    // eslint-disable-next-line no-console
    console.log("Sending raw transaction to Algorand...");
    const response = await algodClient.sendRawTransaction(signedBytes).do();
    
    // Ensure txId is extracted correctly (some versions use txId, others txid)
    const txId = response.txId || response.txid;
    
    if (!txId) {
      throw new Error("Failed to get transaction ID from response");
    }

    // eslint-disable-next-line no-console
    console.log("Transaction sent. ID:", txId);

    // eslint-disable-next-line no-console
    console.log("Waiting for confirmation (this may take 4-5 blocks)...");
    
    try {
      // Increased round timeout for better reliability
      await algosdk.waitForConfirmation(algodClient, txId, 8);
      // eslint-disable-next-line no-console
      console.log("Transaction confirmed successfully.");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Confirmation wait error:", err);
      throw new Error(`Transaction confirmation failed: ${err.message}`);
    }

    // Refresh balance after confirmation
    setTimeout(() => refreshBalance(), 2000);

    return txId;
  };

  const value = useMemo(
    () => ({
      accountAddress,
      balance,
      connecting,
      connectWallet,
      disconnectWallet,
      sendPayment,
      refreshBalance,
    }),
    [accountAddress, balance, connecting]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);

