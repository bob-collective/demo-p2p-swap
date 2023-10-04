import { useState, useCallback, useEffect } from 'react';
import { ContractType, Erc20CurrencyTicker, UINT_256_MAX, contracts } from '../constants';
import { useAccount, usePublicClient } from 'wagmi';
import { useContract } from './useContract';

// Helper hook to check erc20 allowance and provide wrapper that handles allowance;
const useErc20Allowance = (contract: ContractType, ticker: Erc20CurrencyTicker) => {
  const [isErc20TransferApproved, setIsErc20TransferApproved] = useState(false);
  const publicClient = usePublicClient();

  const { address } = useAccount();

  const { read: readErc20Contract, write: writeErc20Contract } = useContract(ContractType[ticker]);

  const fetchAllowance = useCallback(async () => {
    if (readErc20Contract && address) {
      const allowance = await readErc20Contract.allowance([address, contracts[contract].address]);
      // If allowance is lower than maximum, then it is considered unallowed and approval tx is required. (to keep poc simple)
      if (allowance < UINT_256_MAX) {
        setIsErc20TransferApproved(false);
      } else {
        setIsErc20TransferApproved(true);
      }
    }
  }, [readErc20Contract, address, contract]);

  useEffect(() => {
    fetchAllowance();
  }, [fetchAllowance]);

  const wrapInErc20ApprovalTx = useCallback(
    async (subroutine: () => void) => {
      if (!writeErc20Contract || isErc20TransferApproved) {
        return subroutine();
      }

      const txHash = await writeErc20Contract.approve([contracts[contract].address, UINT_256_MAX]);
      await publicClient.waitForTransactionReceipt({ hash: txHash });

      fetchAllowance();
      return subroutine();
    },
    [fetchAllowance, publicClient, writeErc20Contract, isErc20TransferApproved, contract]
  );

  return { isAllowed: isErc20TransferApproved, wrapInErc20ApprovalTx };
};

export { useErc20Allowance };
