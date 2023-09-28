import { isAddressEqual } from 'viem';
import { Erc20Currencies, Erc20Currency, Erc20CurrencyTicker } from '../constants';
import { HexString } from '../types';

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
const toAtomicAmountErc20 = (amount: string, ticker: Erc20CurrencyTicker): bigint => {
  const { decimals } = Erc20Currencies[ticker];
  return BigInt(amount) * BigInt(10 ** decimals);
};

const toBaseAmountErc20 = (amount: bigint, ticker: Erc20CurrencyTicker): string => {
  const { decimals } = Erc20Currencies[ticker];
  return (Number(amount) / 10 ** decimals).toString();
};

export { getErc20CurrencyFromContractAddress, toAtomicAmountErc20, toBaseAmountErc20 };
