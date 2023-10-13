import { BtcMarketplaceAbi } from '../contracts/abi/BtcMarketplace.abi';
import { ERC20Abi } from '../contracts/abi/ERC20.abi';
import { Erc20MarketplaceAbi } from '../contracts/abi/Marketplace.abi';
import { MintUsdtAbi } from '../contracts/abi/MintUsdt.abi';
import { HexString } from '../types';
import { Erc20Currencies, Erc20CurrencyTicker } from './currencies';

// TODO: Figure out how we can reuse the ERC20Currency enum
//       here without need to re-define currencies again.
enum ContractType {
  ZBTC = 'ZBTC',
  USDT = 'USDT',
  ERC20_MARKETPLACE = 'ERC20_MARKETPLACE',
  BTC_MARKETPLACE = 'BTC_MARKETPLACE',
  MINT_USDT = 'MINT_USDT'
}

// Contracts config with contract address and ABI
// that is used in useContract hook to automatically infer smart contract types.
const contracts = {
  // Automatically adds all ERC20 currencies contracts here.
  ...Object.entries(Erc20Currencies).reduce(
    (result, [key, value]) => ({ ...result, [key as ContractType]: { ...value, abi: ERC20Abi } }),
    {} as { [ticker in Erc20CurrencyTicker]: { abi: typeof ERC20Abi; address: HexString } }
  ),
  [ContractType.ERC20_MARKETPLACE]: {
    address: '0xd887C0d5b3982B5D6f2ca67cD8e217E430Add285',
    abi: Erc20MarketplaceAbi
  },
  [ContractType.BTC_MARKETPLACE]: {
    address: '0x086645De538290e5147cD399A160E8339c529191',
    abi: BtcMarketplaceAbi
  },
  [ContractType.MINT_USDT]: {
    // TODO: switch to deployed contract address
    address: '0xE9c966b8cD2182f5946690813fEe78D0Da885ef4',
    abi: MintUsdtAbi
  }
} as const;

export { contracts, ContractType };
