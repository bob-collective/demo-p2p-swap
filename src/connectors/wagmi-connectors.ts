import { configureChains, createConfig, Chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { L2_BLOCK_EXPLORER, L2_CHAIN_ID, L2_MULTICALL3_ADDRESS, L2_RPC_URL, L2_WSS_URL } from '../config';

const L2_PROJECT_ID = 'BOB_P2P_Swap';

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

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
    public: { http: [L2_RPC_URL], webSocket: [L2_WSS_URL] },
    default: { http: [L2_RPC_URL], webSocket: [L2_WSS_URL] }
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
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({ chains, options: { projectId: L2_PROJECT_ID, showQrModal: false, metadata } })
  ]
});

export { config, L2_CHAIN_CONFIG, L2_PROJECT_ID };
