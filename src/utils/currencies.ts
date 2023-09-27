import { Erc20Currencies, Erc20Currency, Erc20CurrencyTicker } from '../constants';
import { HexString } from '../types';

const getErc20CurrencyFromContractAddress = (address: HexString): Erc20Currency => {
  const currency = Object.values(Erc20Currencies).find(({ address: erc20Address }) => erc20Address === address);
  if (currency === undefined) {
    throw new Error(`ERC20 with contract address ${address} is not recognized.`);
  }
  return currency;
};

const toAtomicAmountErc20 = (amount: string, ticker: Erc20CurrencyTicker): bigint => {
  const { decimals } = Erc20Currencies[ticker];
  console.log(amount, BigInt(amount), decimals);
  return BigInt(amount) * BigInt(10 ** decimals);
};

export { getErc20CurrencyFromContractAddress, toAtomicAmountErc20 };
