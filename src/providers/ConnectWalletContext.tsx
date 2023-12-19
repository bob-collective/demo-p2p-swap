import { FC, ReactNode, createContext, useContext, useState } from 'react';

type ConnectWalletData = {
  isOpen: boolean;
  walletTab: 'evm' | 'btc';
  setOpen: (isOpen: boolean, options?: { walletTab?: 'evm' | 'btc' }) => void;
  setWalletTab: (tab: 'evm' | 'btc') => void;
};

const StatsWagmiContext = createContext<ConnectWalletData>({
  isOpen: false,
  walletTab: 'evm',
  setOpen: () => {},
  setWalletTab: () => {}
});

const useConnectWalletModal = (): ConnectWalletData => {
  const context = useContext(StatsWagmiContext);

  if (context === undefined) {
    throw new Error('useConnectWalletModal must be used within a ConnectWalletProvider!');
  }

  return context;
};

type ConnectWalletContextProps = {
  children: ReactNode;
};

const ConnectWalletProvider: FC<ConnectWalletContextProps> = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [walletTab, setWalletTab] = useState<'evm' | 'btc'>('evm');

  const handleOpen = (isOpen: boolean, options?: { walletTab?: 'evm' | 'btc' }) => {
    setOpen(isOpen);

    if (options?.walletTab) {
      setWalletTab(options?.walletTab);
    }
  };

  return (
    <StatsWagmiContext.Provider value={{ isOpen, walletTab, setOpen: handleOpen, setWalletTab }}>
      {children}
    </StatsWagmiContext.Provider>
  );
};

export { ConnectWalletProvider, useConnectWalletModal };
