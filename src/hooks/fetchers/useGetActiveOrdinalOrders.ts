import { useQuery } from '@tanstack/react-query';
import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';
import { ContractType } from '../../constants';
import { HexString } from '../../types';
import { OrdinalOrder } from '../../types/orders';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { calculateOrderDeadline } from '../../utils/orders';
import { useContract } from '../useContract';
import { REFETCH_INTERVAL } from '../../constants/query';

const parseOrdinalOrder = (
  rawOrder: {
    ordinalID: { txId: `0x${string}`; index: number };
    sellToken: `0x${string}`;
    sellAmount: bigint;
    utxo: { txHash: `0x${string}`; txOutputIndex: number; txOutputValue: bigint };
    requester: `0x${string}`;
  },
  address: HexString | undefined,
  id: bigint,
  orderAcceptances: readonly {
    orderId: bigint;
    bitcoinAddress: {
      scriptPubKey: `0x${string}`;
    };
    ercToken: `0x${string}`;
    ercAmount: bigint;
    requester: `0x${string}`;
    acceptor: `0x${string}`;
    acceptTime: bigint;
  }[]
): OrdinalOrder => {
  const acceptedOrder = orderAcceptances.find(({ orderId }) => orderId === id);
  const isOwnerOfOrder = !!address && isAddressEqual(rawOrder.requester, address);

  const askingCurrency = getErc20CurrencyFromContractAddress(rawOrder.sellToken);

  return {
    id,
    askingCurrency: askingCurrency,
    totalAskingAmount: rawOrder.sellAmount,
    deadline: acceptedOrder?.acceptTime ? calculateOrderDeadline(acceptedOrder.acceptTime) : undefined,
    ordinalId: rawOrder.ordinalID,
    utxo: rawOrder.utxo,
    isOwnerOfOrder
  };
};

const useGetActiveOrdinalOrders = () => {
  const { read: readOrdinalMarketplace } = useContract(ContractType.ORD_MARKETPLACE);
  const { address } = useAccount();

  const queryResult = useQuery({
    queryKey: ['active-ordinal-orders', address],
    enabled: !!readOrdinalMarketplace,
    queryFn: async () => {
      const [[rawOrders, ordersIds], [rawOrderAcceptances]] = await Promise.all([
        readOrdinalMarketplace.getOpenOrdinalSellOrders(),
        readOrdinalMarketplace.getOpenAcceptedOrdinalSellOrders()
      ]);

      return rawOrders
        .map((order, index) => parseOrdinalOrder(order, address, ordersIds[index], rawOrderAcceptances))
        .filter(({ deadline }) => !deadline);
      // Filter out empty orders that are not in pending state.
      // .filter((order) => !order.deadline)
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  return queryResult;
};

export { useGetActiveOrdinalOrders };
