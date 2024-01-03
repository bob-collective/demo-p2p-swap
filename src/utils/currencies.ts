import { isAddressEqual } from 'viem';
import {
  BitcoinCurrency,
  Currency,
  CurrencyTicker,
  Erc20Currencies,
  Erc20Currency,
  currencies,
  BitcoinTicker,
  Bitcoin
} from '../constants';
import { HexString } from '../types';
import Big from 'big.js';

const getCurrency = (ticker: CurrencyTicker): Currency => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currency = (currencies as any)[ticker];

  if (!currency) {
    return {
      decimals: 18,
      name: ticker,
      ticker
    };
  }

  return currency;
};

const getErc20CurrencyFromContractAddress = (address: HexString): Erc20Currency => {
  const currency = Object.values(Erc20Currencies).find(({ address: erc20Address }) =>
    isAddressEqual(erc20Address, address)
  );
  if (currency === undefined) {
    throw new Error(`ERC20 with contract address ${address} is not recognized.`);
  }
  return currency;
};

// TODO: handle float amounts too, now handles only integers.
const toAtomicAmount = (amount: string, ticker: CurrencyTicker): bigint => {
  const { decimals } = getCurrency(ticker);

  return BigInt(new Big(amount).mul(new Big(10).pow(decimals)).toString());
};

const toBaseAmount = (amount: bigint, ticker: CurrencyTicker): string => {
  const { decimals } = getCurrency(ticker);
  return (Number(amount) / 10 ** decimals).toString();
};

const isErc20Currency = (currency: Currency): currency is Erc20Currency =>
  (currency as Erc20Currency)?.address !== undefined;

const isBitcoinCurrency = (currency: Currency): currency is BitcoinCurrency => currency.ticker === Bitcoin.ticker;

const isBitcoinTicker = (ticker: string): ticker is BitcoinTicker => ticker === Bitcoin.ticker;

export {
  getCurrency,
  getErc20CurrencyFromContractAddress,
  isBitcoinTicker,
  toAtomicAmount,
  toBaseAmount,
  isErc20Currency,
  isBitcoinCurrency
};
