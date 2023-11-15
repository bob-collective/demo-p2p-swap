import { RelayProvider } from '@opengsn/provider';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Web3Provider } from '@ethersproject/providers';
import { type Signer } from '@ethersproject/abstract-signer';
import { encodeFunctionData } from 'viem';
import { Erc20Currencies, Erc20Currency } from '../constants';

const erc20PaymasterAddress = '0x9c1cacC1020F5D89aaD89ad307efBcA1Da1F1072';
const onboardingPaymasterAddress = '0x05434cfe227c1cDC2dD93d3974B0FC72e38c1cDc';

async function getErc20PaymasterData(relayRequest) {
  return (
    '0x000000000000000000000000FeCC3F37038999Ede8e58A3c9E5B0E9a16e7d5bC' +
    '0000000000000000000000000000000000000000000000000de0b6b3a7640000'
  ); // max 1 usdc
}

type RelayProviderContextValue = {
  relayProvider?: RelayProvider;
  gsnProvider?: Web3Provider;
  gsnSigner?: Signer;
  feeCurrency: Erc20Currency;
  setFeeCurrency: (currency: Erc20Currency) => void;
};

const initialState = {
  relayProvider: undefined,
  gsnProvider: undefined,
  gsnSigner: undefined,
  feeCurrency: Erc20Currencies.USDT,
  setFeeCurrency: () => {}
};

const RelayContextProvider = createContext<RelayProviderContextValue>(initialState);

const useRelayContext = () => {
  const context = useContext(RelayContextProvider);

  if (!context) {
    throw new Error('useRelayContext should be used within a AccountAbstraction Provider');
  }

  return context;
};

const RelayProviderContextProvider = ({ children }: { children: JSX.Element }) => {
  const { connector } = useAccount();

  const [provider, setProvider] = useState<Omit<RelayProviderContextValue, 'feeCurrency' | 'setFeeCurrency'>>({});
  const [feeCurrency, setFeeCurrency] = useState<Erc20Currency>(Erc20Currencies.USDT);

  useEffect(() => {
    const init = async () => {
      const provider = await connector?.getProvider();

      const gsnProvider = await RelayProvider.newEthersV5Provider({
        provider,
        config: {
          loggerConfiguration: { logLevel: 'debug' },
          performDryRunViewRelayCall: false,
          gasPriceSlackPercent: 1000,
          maxPaymasterDataLength: 100,
          paymasterAddress: erc20PaymasterAddress
        },
        overrideDependencies: {
          asyncPaymasterData: getErc20PaymasterData
        }
      });

      setProvider(gsnProvider);
    };

    if (connector) {
      init();
    }
  }, [connector]);

  return (
    <RelayContextProvider.Provider
      value={{ ...provider, feeCurrency, setFeeCurrency: (currency: Erc20Currency) => setFeeCurrency(currency) }}
    >
      {children}
    </RelayContextProvider.Provider>
  );
};

export { RelayProviderContextProvider, useRelayContext };
