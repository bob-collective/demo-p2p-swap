import { FC, ReactNode, createContext, useContext, useState } from 'react';

type ConnectWalletData = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

const StatsWagmiContext = createContext<ConnectWalletData>({
  isOpen: false,
  setOpen: () => {}
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

  return <StatsWagmiContext.Provider value={{ isOpen, setOpen }}>{children}</StatsWagmiContext.Provider>;
};

export { ConnectWalletProvider, useConnectWalletModal };
