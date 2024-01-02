import { useQuery } from '@tanstack/react-query';
import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';
import { ContractType } from '../../constants';
import { REFETCH_INTERVAL } from '../../constants/query';
import { HexString } from '../../types';
import { OrdinalOrder } from '../../types/orders';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { getBrc20Amount } from '../../utils/inscription';
import { calculateOrderDeadline } from '../../utils/orders';
import { useContract } from '../useContract';

const parseOrdinalOrder = async (
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
): Promise<OrdinalOrder> => {
  const acceptedOrder = orderAcceptances.find(({ orderId }) => orderId === id);
  const isOwnerOfOrder = !!address && isAddressEqual(rawOrder.requester, address);

  const askingCurrency = getErc20CurrencyFromContractAddress(rawOrder.sellToken);

  const brc20Amount = await getBrc20Amount(rawOrder.ordinalID);

  return {
    id,
    askingCurrency: askingCurrency,
    totalAskingAmount: rawOrder.sellAmount,
    deadline: acceptedOrder?.acceptTime ? calculateOrderDeadline(acceptedOrder.acceptTime) : undefined,
    ordinalId: rawOrder.ordinalID,
    utxo: rawOrder.utxo,
    brc20Amount,
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

      const data = await Promise.all(
        rawOrders.map((order, index) => parseOrdinalOrder(order, address, ordersIds[index], rawOrderAcceptances))
      );

      return data.filter(({ deadline }) => !deadline);
      // Filter out empty orders that are not in pending state.
      // .filter((order) => !order.deadline)
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  return queryResult;
};

export { useGetActiveOrdinalOrders };
