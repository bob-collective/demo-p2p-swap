import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { XVerseConnector } from './connectors';
import { SatsConnector } from './connectors/base';

type SatsConfigData = {
  connector?: SatsConnector;
  connectors: SatsConnector[];
  setConnector: (connector?: SatsConnector) => void;
};

const StatsWagmiContext = createContext<SatsConfigData>({
  connector: undefined,
  connectors: [],
  setConnector: () => {}
});

const useSatsWagmi = (): SatsConfigData => {
  const context = useContext(StatsWagmiContext);

  if (context === undefined) {
    throw new Error('useSatsWagmi must be used within a SatsWagmiConfig!');
  }

  return context;
};

type SatsWagmiConfigProps = {
  children: ReactNode;
};

const SatsWagmiConfig: FC<SatsWagmiConfigProps> = ({ children }) => {
  const [connectors, setConnectors] = useState<SatsConnector[]>([]);
  const [connector, setCurrentConnector] = useState<SatsConnector>();

  useEffect(() => {
    const init = () => {
      const readyConnectors: SatsConnector[] = [];

      const xverse = new XVerseConnector();

      if (xverse.ready) {
        readyConnectors.push(xverse);
      }

      setConnectors(readyConnectors);
    };

    init();
  }, []);

  const setConnector = useCallback((connector?: SatsConnector) => {
    setCurrentConnector(connector);
  }, []);

  return (
    <StatsWagmiContext.Provider value={{ connectors, connector, setConnector }}>{children}</StatsWagmiContext.Provider>
  );
};

export { SatsWagmiConfig, useSatsWagmi };
