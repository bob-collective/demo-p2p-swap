import { configureChains, createConfig, Chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { L2_BLOCK_EXPLORER, L2_CHAIN_ID, L2_MULTICALL3_ADDRESS, L2_RPC_URL } from '../config';

const L2_CHAIN_CONFIG = {
  id: L2_CHAIN_ID,
  name: 'BOB L2 dev',
  network: 'BOB-L2-dev',
  nativeCurrency: {
    decimals: 18,
    name: 'Bob',
    symbol: 'BOB'
  },
  rpcUrls: {
    public: { http: [L2_RPC_URL] },
    default: { http: [L2_RPC_URL] }
  },
  blockExplorers: {
    default: { name: 'BobScan', url: L2_BLOCK_EXPLORER }
  },
  contracts: {
    multicall3: {
      address: L2_MULTICALL3_ADDRESS
    }
  }
} as const satisfies Chain;

const { chains, publicClient, webSocketPublicClient } = configureChains([L2_CHAIN_CONFIG], [publicProvider()]);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [new MetaMaskConnector({ chains })]
});

export { config, L2_CHAIN_CONFIG };
