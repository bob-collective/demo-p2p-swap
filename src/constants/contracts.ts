import { BtcMarketplaceAbi } from '../contracts/abi/BtcMarketplace.abi';
import { ERC20Abi } from '../contracts/abi/ERC20.abi';
import { Erc20MarketplaceAbi } from '../contracts/abi/Marketplace.abi';
import { FaucetAbi } from '../contracts/abi/Faucet.abi';
import { HexString } from '../types';
import { Erc20Currencies, Erc20CurrencyTicker } from './currencies';
import { OwnershipAbi } from '../contracts/abi/Ownership.abi';
import { PingAbi } from '../contracts/abi/Ping.abi';

// TODO: Figure out how we can reuse the ERC20Currency enum
//       here without need to re-define currencies again.
enum ContractType {
  ZBTC = 'ZBTC',
  USDT = 'USDT',
  ERC20_MARKETPLACE = 'ERC20_MARKETPLACE',
  BTC_MARKETPLACE = 'BTC_MARKETPLACE',
  FAUCET = 'FAUCET',
  OWNERSHIP = 'OWNERSHIP',
  PING = 'PING'
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
    address: '0x79922D5e77202d44df6886aDD602200b70634Db5',
    abi: Erc20MarketplaceAbi
  },
  [ContractType.BTC_MARKETPLACE]: {
    address: '0x0dB82Bc7CA64fA7f782F09ad7986fed75D42d461',
    abi: BtcMarketplaceAbi
  },
  [ContractType.FAUCET]: {
    // TODO: switch to deployed contract address
    address: '0x5451f7e2458CEa3e088c6976A7d40f443655C0A0',
    abi: FaucetAbi
  },
  [ContractType.OWNERSHIP]: {
    address: '0x5Fa5CFD2f75963e7c94e973Dd5a93b8F999A2215',
    abi: OwnershipAbi
  },
  [ContractType.PING]: {
    address: '0x1C8274044929c73a0808d1D7d0fC2Fb2D51A880c',
    abi: PingAbi
  }
} as const;

export { contracts, ContractType };
