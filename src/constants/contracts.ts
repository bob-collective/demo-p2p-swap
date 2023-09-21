import { ERC20Abi } from '../contracts/abi/ERC20.abi';
import { MarketplaceAbi } from '../contracts/abi/Marketplace.abi';
import { HexString } from '../types';
import { ERC20Currencies, ERC20Currency } from './currencies';

// TODO: Figure out how we can reuse the ERC20Currency enum
//       here without need to re-define currencies again.
enum ContractType {
  ZBTC = 'ZBTC',
  USDT = 'USDT',
  MARKETPLACE = 'MARKETPLACE'
}

// Contracts config with contract address and ABI
// that is used in useContract hook to automatically infer smart contract types.
const contracts = {
  // Automatically adds all ERC20 currencies contracts here.
  ...Object.entries(ERC20Currencies).reduce(
    (result, [key, value]) => ({ ...result, [key as ContractType]: { ...value, abi: ERC20Abi } }),
    {} as { [ticker in ERC20Currency]: { abi: typeof ERC20Abi; address: HexString } }
  ),
  [ContractType.MARKETPLACE]: {
    address: '0x8AFE17149acA25bD009dB723D8D56672E2230bCc',
    abi: MarketplaceAbi
  }
} as const;

export { contracts, ContractType };
