import { useCallback, useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { Bitcoin, CurrencyTicker, Erc20Currencies, Erc20CurrencyTicker, currencies } from '../constants';
import { ERC20Abi } from '../contracts/abi/ERC20.abi';
import { Amount } from '../utils/amount';
import { isBitcoinTicker, toBaseAmount } from '../utils/currencies';

type Balances = {
  [ticker in Erc20CurrencyTicker]: bigint;
};

const useBalances = () => {
  const [balances, setBalances] = useState<Balances | undefined>(undefined);
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

  const getBalance = useCallback(
    (ticker: CurrencyTicker) => {
      if (isBitcoinTicker(ticker) || balances?.[ticker] === undefined) {
        return new Amount(Bitcoin, 0);
      }

      return new Amount(currencies[ticker], Number(balances[ticker]));
    },
    [balances]
  );

  const getBalanceInBaseDecimals = useCallback(
    (ticker: CurrencyTicker) => {
      if (isBitcoinTicker(ticker) || balances?.[ticker] === undefined) {
        return 0;
      }

      return toBaseAmount(balances[ticker], Erc20Currencies[ticker].ticker);
    },
    [balances]
  );

  return { balances, getBalance, getBalanceInBaseDecimals };
};

export { useBalances };
