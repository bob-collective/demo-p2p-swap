import { HexString } from '../types';

enum Erc20CurrencyTicker {
  WBTC = 'WBTC',
  USDC = 'USDC'
}

type CurrencyTicker = string;

interface CurrencyBase {
  ticker: string;
  name: string;
  decimals: number;
}

interface Erc20Currency extends CurrencyBase {
  ticker: Erc20CurrencyTicker;
  address: HexString;
}

interface Brc20Currency extends CurrencyBase {
  decimals: 18;
}

type BitcoinTicker = 'BTC';

const Bitcoin = {
  ticker: 'BTC' as BitcoinTicker,
  name: 'Bitcoin',
  decimals: 8
} as const;

type BitcoinCurrency = typeof Bitcoin;

type Currency = Erc20Currency | BitcoinCurrency | Brc20Currency;

const Erc20Currencies: {
  [ticker in Erc20CurrencyTicker]: Erc20Currency;
} = {
  [Erc20CurrencyTicker.WBTC]: {
    ticker: Erc20CurrencyTicker.WBTC,
    name: 'wBTC',
    decimals: 8,
    address: '0xF6b2B29eCBe3b5A39da1306849A127e35Ea8131a'
  },
  [Erc20CurrencyTicker.USDC]: {
    ticker: Erc20CurrencyTicker.USDC,
    name: 'USDC',
    decimals: 6,
    address: '0x8aa78aBb7F48e65cA96769C28eb99b3F26E43E3E'
  }
};

const currencies = {
  ...Erc20Currencies,
  BTC: Bitcoin
};

export { Erc20Currencies, Erc20CurrencyTicker, currencies, Bitcoin };
export type { Erc20Currency, Currency, BitcoinCurrency, BitcoinTicker, CurrencyTicker, Brc20Currency };
