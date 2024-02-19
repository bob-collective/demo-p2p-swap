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
    address: '0x8FC9293bC9E4431D32079726478D5B93aC153c3c',
    abi: Erc20MarketplaceAbi
  },
  [ContractType.BTC_MARKETPLACE]: {
    address: '0x1F229978BC874f099f8C224c69863cCa24d9EE54',
    abi: BtcMarketplaceAbi
  },
  [ContractType.ORD_MARKETPLACE]: {
    address: '0x06Bd6358F90F0c83523A4ab9135a61F41cF77850',
    abi: OrdMarketplaceAbi
  },
  [ContractType.FAUCET]: {
    address: '0x7884560F14c62E0a83420F17832988cC1a775df1',
    abi: FaucetAbi
  }
} as const;

export { contracts, ContractType };
