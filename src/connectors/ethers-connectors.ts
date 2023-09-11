import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";
import { L2_WSS_URL } from "../config";

//TODO: move to separate type declarations file
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const getConnectors = async () => {
  let signer = null;

  let provider;
  if (window.ethereum == null) {
    // If MetaMask is not installed, we use the JSON RPC provider
    // for L2 chain with read-only access.
    console.log("MetaMask not installed; using read-only defaults");
    provider = ethers.getDefaultProvider(L2_WSS_URL);
  } else {
    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    provider = new ethers.BrowserProvider(window.ethereum);

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    signer = await provider.getSigner();
  }

  return { provider, signer };
};

export { getConnectors };
