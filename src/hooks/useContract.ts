import { useEffect, useState } from "react";
import { contracts, ContractType } from "../contracts/config";
import { useConnectors } from "./useConnectors";

// Wrapper around ethers Contract to automatically get contract types
// with read and write objects automatically constructed from provider and signer.
const useContract = (contractType: ContractType) => {
  const { address, connect } = contracts[contractType];

  const {
    connectors: { provider, signer },
    isLoading: isLoadingConnectors,
  } = useConnectors();

  const [read, setRead] = useState<ReturnType<typeof connect> | null>(null);
  const [write, setWrite] = useState<ReturnType<typeof connect> | null>(null);

  useEffect(() => {
    if (isLoadingConnectors) {
      return;
    }

    if (provider) {
      const reader = connect(address, provider);
      setRead(reader);
    } else {
      setRead(null);
    }

    if (signer) {
      const writer = connect(address, signer);
      setWrite(writer);
    } else {
      setWrite(null);
    }
  }, [address, connect, isLoadingConnectors, provider, signer]);

  return { read, write };
};

export { useContract };
