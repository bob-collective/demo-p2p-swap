import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { ContractType, contracts } from '../constants';
import { useRelayContext } from '../context/RelayProviderContext';

function useContract(contractType: ContractType) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const { gsnSigner, gsnProvider } = useRelayContext();

  useEffect(() => {
    // Ensure you have an Ethereum provider set up, e.g., with MetaMask
    if (gsnProvider) {
      const contractObj = contracts[contractType];

      const contractInit = new ethers.Contract(contractObj.address, contractObj.abi, gsnSigner || gsnProvider);
      setContract(contractInit);
    }
  }, [contractType, gsnProvider, gsnSigner]);

  // Read function
  const read = async (methodName: string, args: unknown[] = []) => {
    if (!contract) {
      console.error(' read :Contract not initialized. Check your Ethereum provider.');
      return null;
    }

    try {
      const result = await contract[methodName](...args);
      return result;
    } catch (error) {
      console.error(`Error calling read function ${methodName}:`, error);
      return null;
    }
  };

  // Write function (for transactions)
  const write = async (methodName: string, args: unknown[] = []) => {
    if (!contract) {
      console.error('write; Contract not initialized. Check your Ethereum provider.');
      return null;
    }

    console.log(contract);

    try {
      const gasLimit = await contract.estimateGas[methodName](...args, { gasPrice: 0 });
      const txOptions = { gasPrice: await gsnProvider?.getGasPrice(), gasLimit };
      const transaction = await contract[methodName](...args, txOptions);
      await transaction.wait();
      return transaction;
    } catch (error) {
      console.error(`Error calling write function ${methodName}:`, error);
      return null;
    }
  };

  return { read: contract ? read : undefined, write: contract ? write : undefined };
}

export { useContract };
