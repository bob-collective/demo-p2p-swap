import { useEffect, useState } from 'react';
import { ContractType } from '../../constants';
import { useContract } from '../useContract';

const useGetActiveOrders = () => {
  const [activeOrders, setActiveOrders] = useState<unknown>();
  const { read } = useContract(ContractType.MARKETPLACE);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      if (!read) return;
      const orders = await read.getOpenOrders();

      // TODO: parse orders

      setActiveOrders(orders);
    };

    fetchActiveOrders();
  }, [read]);

  // TODO: return callback to refetch data

  return activeOrders;
};

export { useGetActiveOrders };
