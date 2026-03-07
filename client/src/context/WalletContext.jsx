import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PeraWalletConnect } from "@perawallet/connect";
import algosdk from "algosdk";
import { algodClient } from "../services/algorand";

const WalletContext = createContext(null);

const peraWallet = new PeraWalletConnect({
  chainId: 416002, // TestNet (numeric)
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
      .catch(() => {
        // ignore missing/invalid session
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!accountAddress) {
        setBalance(null);
        return;
      }
      try {
        const info = await algodClient.accountInformation(accountAddress).do();
        setBalance(info.amount / 1_000_000);
      } catch {
        setBalance(null);
      }
    };
    fetchBalance();
  }, [accountAddress]);

  const subscribeToDisconnect = () => {
    peraWallet.connector?.on("disconnect", () => {
      setAccountAddress(null);
      setBalance(null);
    });
  };

  const connectWallet = async () => {
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
        console.error("Wallet connect error", error);
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
    const txnGroup = [{ txn }];

    const signedTxn = await peraWallet.signTransaction([txnGroup]);

    const signedBytes = signedTxn.map((t) => t ? new Uint8Array(t) : t);

    const { txId } = await algodClient.sendRawTransaction(signedBytes).do();

    await algosdk.waitForConfirmation(algodClient, txId, 4);

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
    }),
    [accountAddress, balance, connecting]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);

