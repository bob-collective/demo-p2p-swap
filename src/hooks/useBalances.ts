import { useAccount, usePublicClient } from 'wagmi';
import { ERC20Abi } from '../contracts/abi/ERC20.abi';
import { useCallback, useEffect, useState } from 'react';
import { ERC20Currency, ERC20Currencies } from '../constants';

type Balances = {
  [ticker in ERC20Currency]: bigint;
};

const initialBalances = Object.keys(ERC20Currencies).reduce(
  (result, ticker) => ({ ...result, [ticker]: undefined }),
  {}
) as Balances;

const useBalances = () => {
  const [balances, setBalances] = useState<Balances>(initialBalances);
  const publicClient = usePublicClient();
  const { address } = useAccount();

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address || !publicClient) {
        return;
      }

      const balancesMulticallResult = await publicClient.multicall({
        contracts: Object.values(ERC20Currencies).map(({ address }) => ({
          abi: ERC20Abi,
          address,
          functionName: 'balanceOf',
          args: [address]
        }))
      });

      const balancesResult = Object.keys(ERC20Currencies).reduce<Balances>(
        (result, ticker, index) => ({ ...result, [ticker]: balancesMulticallResult[index].result }),
        {} as Balances
      );

      setBalances(balancesResult);
    };
    fetchBalances();
  }, [address, publicClient]);

  useEffect(() => {
    // TODO: add transfer event listener and update balance on transfer in/out
  });

  const getBalanceInBaseDecimals = useCallback(
    (ticker: ERC20Currency) => {
      if (balances[ticker] === undefined) {
        return 0;
      }

      return balances[ticker] / BigInt(10 ** ERC20Currencies[ticker].decimals);
    },
    [balances]
  );

  return { balances, getBalanceInBaseDecimals };
};

export { useBalances };
