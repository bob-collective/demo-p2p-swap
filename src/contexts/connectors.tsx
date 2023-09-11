import { ethers } from "ethers";
import { createContext, ReactNode, useEffect, useState } from "react";
import { getConnectors } from "../connectors/ethers-connectors";

interface Connectors {
  provider: ethers.BrowserProvider | ethers.AbstractProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

interface ConnectorsContextValue {
  connectors: Connectors;
  isLoading: boolean;
}

const uninitializedConnectors = {
  provider: null,
  signer: null,
};

const initialConnectorsContext = {
  connectors: uninitializedConnectors,
  isLoading: true,
};

const ConnectorsContext = createContext<ConnectorsContextValue>(
  initialConnectorsContext
);

const ConnectorsProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [connectors, setConnectors] = useState<Connectors>(
    uninitializedConnectors
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConnectors = async () => {
      setIsLoading(true);
      const currentConnectors = await getConnectors();
      setConnectors(currentConnectors);
      setIsLoading(false);
    };

    fetchConnectors();

    // Add event listener and re-fetch connectors when account changes in
    // MetaMask.
    const onAccountsChangedListener = () => {
      fetchConnectors();
    };
    window.ethereum?.on("accountsChanged", onAccountsChangedListener);

    return () => {
      window.ethereum?.removeListener(
        "accountsChanged",
        onAccountsChangedListener
      );
    };
  }, []);

  return (
    <ConnectorsContext.Provider value={{ connectors, isLoading }}>
      {children}
    </ConnectorsContext.Provider>
  );
};

export { ConnectorsContext, ConnectorsProvider };
export type { ConnectorsContextValue };
