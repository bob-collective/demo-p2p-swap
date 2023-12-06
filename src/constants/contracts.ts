import { BtcMarketplaceAbi } from '../contracts/abi/BtcMarketplace.abi';
import { ERC20Abi } from '../contracts/abi/ERC20.abi';
import { Erc20MarketplaceAbi } from '../contracts/abi/Marketplace.abi';
import { FaucetAbi } from '../contracts/abi/Faucet.abi';
import { HexString } from '../types';
import { Erc20Currencies, Erc20CurrencyTicker } from './currencies';

// TODO: Figure out how we can reuse the ERC20Currency enum
//       here without need to re-define currencies again.
enum ContractType {
  ZBTC = 'ZBTC',
  USDT = 'USDT',
  ERC20_MARKETPLACE = 'ERC20_MARKETPLACE',
  BTC_MARKETPLACE = 'BTC_MARKETPLACE',
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
    address: '0x69F14d077Fcc88e70F4737a48fE09C0FD32506FB',
    abi: Erc20MarketplaceAbi
  },
  [ContractType.BTC_MARKETPLACE]: {
    address: '0x0cfd830a59e94b6957609fFd85CcDD742C521F34',
    abi: BtcMarketplaceAbi
  },
  [ContractType.FAUCET]: {
    address: '0x5451f7e2458CEa3e088c6976A7d40f443655C0A0',
    abi: FaucetAbi
  }
} as const;

export { contracts, ContractType };
