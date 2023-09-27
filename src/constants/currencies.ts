import { HexString } from '../types';

enum Erc20CurrencyTicker {
  ZBTC = 'ZBTC',
  USDT = 'USDT'
}

interface Erc20Currency {
  ticker: Erc20CurrencyTicker;
  name: string;
  decimals: number;
  address: HexString;
}

const Erc20Currencies: {
  [ticker in Erc20CurrencyTicker]: Erc20Currency;
} = {
  [Erc20CurrencyTicker.ZBTC]: {
    ticker: Erc20CurrencyTicker.ZBTC,
    name: 'zBTC',
    decimals: 18,
    address: '0xd6cd079ee8bc26b5000a5e1ea8d434c840e3434b'
  },
  [Erc20CurrencyTicker.USDT]: {
    ticker: Erc20CurrencyTicker.USDT,
    name: 'Tether USD',
    decimals: 6,
    address: '0x3c252953224948E441aAfdE7b391685201ccd3bC'
  }
};

export { Erc20Currencies, Erc20CurrencyTicker };
export type { Erc20Currency };
