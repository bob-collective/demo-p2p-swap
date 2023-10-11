import { HexString } from '../types';

enum Erc20CurrencyTicker {
  ZBTC = 'ZBTC',
  USDT = 'USDT'
}

type CurrencyTicker = keyof typeof Erc20CurrencyTicker | BitcoinTicker;

interface CurrencyBase {
  ticker: string;
  name: string;
  decimals: number;
}

interface Erc20Currency extends CurrencyBase {
  ticker: Erc20CurrencyTicker;
  address: HexString;
}

type BitcoinTicker = 'BTC';

const Bitcoin = {
  ticker: 'BTC' as BitcoinTicker,
  name: 'Bitcoin',
  decimals: 8
} as const;

type BitcoinCurrency = typeof Bitcoin;

type Currency = Erc20Currency | BitcoinCurrency;

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

const currencies = {
  ...Erc20Currencies,
  BTC: Bitcoin
};

export { Erc20Currencies, Erc20CurrencyTicker, currencies, Bitcoin };
export type { Erc20Currency, Currency, BitcoinCurrency, BitcoinTicker, CurrencyTicker };
