import algosdk from "algosdk";

export const ALGOD_NODE = "https://testnet-api.algonode.cloud";
export const ALGOD_TOKEN = "";
export const ALGOD_PORT = "";

export const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_NODE, ALGOD_PORT);

export const TESTNET_EXPLORER_TX_BASE =
  "https://testnet.algoexplorer.io/tx/";

