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
  const { decimals } = currencies[ticker];

  return BigInt(new Big(amount).mul(new Big(10).pow(decimals)).toString());
};

const toBaseAmount = (amount: bigint, ticker: CurrencyTicker): string => {
  const { decimals } = currencies[ticker];
  return (Number(amount) / 10 ** decimals).toString();
};

const isErc20Currency = (currency: Currency): currency is Erc20Currency =>
  (currency as Erc20Currency)?.address !== undefined;

const isBitcoinCurrency = (currency: Currency): currency is BitcoinCurrency => currency.ticker === Bitcoin.ticker;

const isBitcoinTicker = (ticker: string): ticker is BitcoinTicker => ticker === Bitcoin.ticker;

export {
  getErc20CurrencyFromContractAddress,
  isBitcoinTicker,
  toAtomicAmount,
  toBaseAmount,
  isErc20Currency,
  isBitcoinCurrency
};
