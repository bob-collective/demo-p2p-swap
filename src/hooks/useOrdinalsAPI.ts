import { BITCOIN_NETWORK } from '../utils/bitcoin';
import { DefaultOrdinalsClient } from './ordinalsApi';
import { useState, useEffect } from 'react';

const useOrdinalsAPI = () => {
  const [client, setClient] = useState<DefaultOrdinalsClient>();

  useEffect(() => {
    const initClient = () => {
      const client = new DefaultOrdinalsClient(BITCOIN_NETWORK);
      setClient(client);
    };

    initClient();
  }, []);

  return client;
};

export { useOrdinalsAPI };
