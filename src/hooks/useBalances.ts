import { useQuery } from '@tanstack/react-query';

import Big from 'big.js';
import { useCallback } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { Erc20Currencies, Erc20CurrencyTicker } from '../constants';
import { REFETCH_INTERVAL } from '../constants/query';
import { ERC20Abi } from '../contracts/abi/ERC20.abi';
import { Amount } from '../utils/amount';
import { getCurrency, isBitcoinTicker } from '../utils/currencies';
import { useGetOrders } from './fetchers/useGetOrders';

type Balances = {
  [ticker in Erc20CurrencyTicker]: bigint;
};

const useBalances = () => {
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const { data: orders } = useGetOrders();

  // TODO: add transfer event listener and update balance on transfer in/out
  const { data, ...queryResult } = useQuery({
    queryKey: ['balances', address],
    enabled: !!address && !!publicClient,
    queryFn: async () => {
      const balancesMulticallResult = await publicClient.multicall({
        contracts: Object.values(Erc20Currencies).map(({ address: erc20Address }) => ({
          abi: ERC20Abi,
          address: erc20Address,
          functionName: 'balanceOf',
          args: [address]
        }))
      });

      return Object.keys(Erc20Currencies).reduce<Balances>(
        (result, ticker, index) => ({ ...result, [ticker]: balancesMulticallResult[index].result }),
        {} as Balances
      );
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  const getBalance = useCallback(
    (ticker: Erc20CurrencyTicker) => {
      const currency = getCurrency(ticker);

      if (isBitcoinTicker(ticker) || data?.[ticker] === undefined) {
        return new Amount(currency, 0);
      }

      const current = new Amount(getCurrency(ticker), Number(data[ticker]));

      // TODO: might need to include accepted orders
      const toDeduct = orders.owned.reduce(
        (acc, order) =>
          order.offeringCurrency.ticker === currency.ticker
            ? acc.add(new Amount(order.offeringCurrency, Number(order.availableLiquidity)).toBig())
            : acc,
        new Big(0)
      );

      const balance = current.toBig().minus(toDeduct);

      return balance.gt(0) ? new Amount(currency, balance, true) : new Amount(currency, 0);
    },
    [data, orders.owned]
  );

  return { ...queryResult, balances: data, getBalance };
};

export { useBalances };
