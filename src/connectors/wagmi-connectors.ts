import { Chain, configureChains, createConfig } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { L2_BLOCK_EXPLORER, L2_CHAIN_ID, L2_MULTICALL3_ADDRESS, L2_RPC_URL, L2_WSS_URL } from '../config';
import { LedgerConnector } from 'wagmi/connectors/ledger';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

const L2_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string;

const L2_METADATA = {
  name: 'BOB: Peer to Peer Swap',
  description: 'BOB Peer to Peer Swap Demo',
  url: 'https://demo.gobob.xyz',
  icons: ['https://uploads-ssl.webflow.com/64e85c2f3609488b3ed725f4/64ecae53ef4b561482f1c49f_bob1.jpg']
};

const L2_CHAIN_CONFIG = {
  id: L2_CHAIN_ID,
  name: 'BOB L2 Demo',
  network: 'BOB-L2-Demo',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH'
  },
  rpcUrls: {
    public: { http: [L2_RPC_URL], webSocket: L2_WSS_URL && [L2_WSS_URL] },
    default: { http: [L2_RPC_URL], webSocket: L2_WSS_URL && [L2_WSS_URL] }
  },
  blockExplorers: {
    default: { name: 'BobScan', url: L2_BLOCK_EXPLORER }
  },
  contracts: L2_MULTICALL3_ADDRESS && {
    multicall3: {
      address: L2_MULTICALL3_ADDRESS
    }
  }
} as const satisfies Chain;

const chains = [L2_CHAIN_CONFIG];

const { publicClient, webSocketPublicClient } = configureChains(chains, [publicProvider()]);
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true
      }
    }),
    new LedgerConnector({
      chains,
      options: {
        enableDebugLogs: process.env.NODE_ENV !== 'production'
      }
    }),
    new WalletConnectConnector({
      chains,
      options: {
        showQrModal: true,
        projectId: L2_PROJECT_ID,
        metadata: {
          name: 'BOB',
          description: 'NOTE: TO BE ADDED',
          url: 'https://www.gobob.xyz',
          // TODO: change
          icons: ['https://uploads-ssl.webflow.com/64e85c2f3609488b3ed725f4/64ecae53ef4b561482f1c49f_bob1.jpg']
        }
      }
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'BOB',
        appLogoUrl: 'https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/token/sushi.jpg'
      }
    })
  ]
});

export { L2_CHAIN_CONFIG, L2_METADATA, L2_PROJECT_ID, config, publicClient };
