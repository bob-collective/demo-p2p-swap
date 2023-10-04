import { useAccount, usePublicClient } from 'wagmi';
import { ERC20Abi } from '../contracts/abi/ERC20.abi';
import { useCallback, useEffect, useState } from 'react';
import { Erc20CurrencyTicker, Erc20Currencies, CurrencyTicker } from '../constants';
import { isBitcoinTicker } from '../utils/currencies';

type Balances = {
  [ticker in Erc20CurrencyTicker]: bigint;
};

const initialBalances = Object.keys(Erc20Currencies).reduce(
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
        contracts: Object.values(Erc20Currencies).map(({ address: erc20Address }) => ({
          abi: ERC20Abi,
          address: erc20Address,
          functionName: 'balanceOf',
          args: [address]
        }))
      });

      const balancesResult = Object.keys(Erc20Currencies).reduce<Balances>(
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
    (ticker: CurrencyTicker) => {
      if (isBitcoinTicker(ticker) || balances[ticker] === undefined) {
        return 0;
      }

      return parseFloat((balances[ticker] / BigInt(10 ** Erc20Currencies[ticker].decimals)).toString());
    },
    [balances]
  );

  return { balances, getBalanceInBaseDecimals };
};

export { useBalances };
