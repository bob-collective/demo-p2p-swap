import { HexString } from '../types';

enum ERC20Currency {
  ZBTC = 'ZBTC',
  USDT = 'USDT'
}

const ERC20Currencies: {
  [ticker in ERC20Currency]: {
    ticker: string;
    name: string;
    decimals: number;
    address: HexString;
  };
} = {
  [ERC20Currency.ZBTC]: {
    ticker: 'ZBTC',
    name: 'zBTC',
    decimals: 18,
    address: '0xd6cd079ee8bc26b5000a5e1ea8d434c840e3434b'
  },
  [ERC20Currency.USDT]: {
    ticker: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: '0x3c252953224948E441aAfdE7b391685201ccd3bC'
  }
};

export { ERC20Currencies, ERC20Currency };
