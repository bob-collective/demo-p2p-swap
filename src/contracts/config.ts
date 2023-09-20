import { ERC20Abi } from './abi/ERC20.abi';
import { MarketplaceAbi } from './abi/Marketplace.abi';

enum ContractType {
  ZBTC = 'ZBTC',
  MARKETPLACE = 'MARKETPLACE'
}

// Contracts config with contract address and ABI
// that is used in useContract hook to automatically infer smart contract types.
const contracts = {
  [ContractType.ZBTC]: {
    address: '0xd6cd079ee8bc26b5000a5e1ea8d434c840e3434b',
    abi: ERC20Abi
  },
  [ContractType.MARKETPLACE]: {
    address: '0x24F20f029FCab92fEebFb8cf417cb7e4a02866B9',
    abi: MarketplaceAbi
  }
} as const;

export { contracts, ContractType };
