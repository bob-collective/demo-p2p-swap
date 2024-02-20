import { BtcMarketplaceAbi } from '../contracts/abi/BtcMarketplace.abi';
import { ERC20Abi } from '../contracts/abi/ERC20.abi';
import { Erc20MarketplaceAbi } from '../contracts/abi/Marketplace.abi';
import { FaucetAbi } from '../contracts/abi/Faucet.abi';
import { HexString } from '../types';
import { Erc20Currencies, Erc20CurrencyTicker } from './currencies';
import { OrdMarketplaceAbi } from '../contracts/abi/OrdMarketplace.abi';

// TODO: Figure out how we can reuse the ERC20Currency enum
//       here without need to re-define currencies again.
enum ContractType {
  WBTC = 'WBTC',
  USDC = 'USDC',
  ERC20_MARKETPLACE = 'ERC20_MARKETPLACE',
  BTC_MARKETPLACE = 'BTC_MARKETPLACE',
  ORD_MARKETPLACE = 'ORD_MARKETPLACE',
  FAUCET = 'FAUCET'
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
    address: '0xbA4415009b3a2218f6e377Aa03e5eA1D373d27f3',
    abi: Erc20MarketplaceAbi
  },
  [ContractType.BTC_MARKETPLACE]: {
    address: '0x58CB036Ac410fbB5016684d5B5EEe36782b9EC32',
    abi: BtcMarketplaceAbi
  },
  [ContractType.ORD_MARKETPLACE]: {
    address: '0xf71136c937357eBcC874c15414FB76B111620932',
    abi: OrdMarketplaceAbi
  },
  [ContractType.FAUCET]: {
    address: '0x7884560F14c62E0a83420F17832988cC1a775df1',
    abi: FaucetAbi
  }
} as const;

export { contracts, ContractType };
