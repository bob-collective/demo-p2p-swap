import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Brc20Currency } from '../constants';
import { useAccount } from '../lib/sats-wagmi';
import { Amount } from '../utils/amount';

type Response = {
  availableBalance: string;
  overallBalance: string;
  ticker: string;
  transferableBalance: string;
};

const queryFn = async (address: string): Promise<Record<string, number>> => {
  const res = await fetch(`https://open-api-testnet.unisat.io/v1/indexer/address/${address}/brc20/summary`, {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_UNISAT_API_TOKEN}` // notice the Bearer before your token
    }
  });

  const response = await res.json();

  return response.data.detail.reduce(
    (acc: Record<string, number>, token: Response) => ({ ...acc, [token.ticker]: Number(token.availableBalance) }),
    {}
  );
};

const useBrc20Balances = () => {
  const { address } = useAccount();

  const { data, ...query } = useQuery(['balances', address], () => (address ? queryFn(address) : undefined), {
    enabled: !!address
  });

  const getBalance = useCallback(
    (ticker: string) => {
      const currency: Brc20Currency = {
        ticker,
        name: ticker,
        decimals: 18
      };

      if (data?.[ticker] === undefined) {
        return new Amount(currency, 0);
      }

      return new Amount(currency, data[ticker], true);
    },
    [data]
  );

  return { ...query, balances: data, getBalance };
};

export { useBrc20Balances };
