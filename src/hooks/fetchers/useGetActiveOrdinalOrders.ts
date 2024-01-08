import { useQuery } from '@tanstack/react-query';
import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';
import { ContractType } from '../../constants';
import { REFETCH_INTERVAL } from '../../constants/query';
import { HexString } from '../../types';
import { Brc20Order, OrdinalOrder } from '../../types/orders';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { getBrc20Amount } from '../../utils/inscription';
import { calculateOrderDeadline, calculateOrderPrice } from '../../utils/orders';
import { useContract } from '../useContract';

type RawOrder = {
  ordinalID: { txId: `0x${string}`; index: number };
  sellToken: `0x${string}`;
  sellAmount: bigint;
  utxo: { txHash: `0x${string}`; txOutputIndex: number; txOutputValue: bigint };
  requester: `0x${string}`;
};

type OrderAcceptance = {
  orderId: bigint;
  bitcoinAddress: {
    scriptPubKey: `0x${string}`;
  };
  ercToken: `0x${string}`;
  ercAmount: bigint;
  requester: `0x${string}`;
  acceptor: `0x${string}`;
  acceptTime: bigint;
};

const parseOrdinalOrder = (
  rawOrder: RawOrder,
  address: HexString | undefined,
  id: bigint,
  orderAcceptances: readonly OrderAcceptance[]
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

const parseBrc20Order = async (
  rawOrder: RawOrder,
  address: HexString | undefined,
  id: bigint,
  orderAcceptances: readonly OrderAcceptance[]
): Promise<Brc20Order> => {
  const order = parseOrdinalOrder(rawOrder, address, id, orderAcceptances);

  const amount = await getBrc20Amount(rawOrder.ordinalID);

  if (!amount) {
    throw new Error('Invalid inscription');
  }

  const price = calculateOrderPrice(amount.toAtomic(), amount.currency, rawOrder.sellAmount, order.askingCurrency);

  return {
    ...order,
    price,
    amount
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

      const brc20 = (
        await Promise.all(
          rawOrders.map(async (order, idx) => {
            const isBrc20 = !!(await getBrc20Amount(order.ordinalID));

            return isBrc20 ? await parseBrc20Order(order, address, ordersIds[idx], rawOrderAcceptances) : undefined;
          })
        )
      ).filter((order) => order && !order.deadline) as Brc20Order[];

      const ordinals = (
        await Promise.all(
          rawOrders.map(async (order, idx) => {
            const isBrc20 = !!(await getBrc20Amount(order.ordinalID));

            return isBrc20 ? undefined : parseOrdinalOrder(order, address, ordersIds[idx], rawOrderAcceptances);
          })
        )
      ).filter((order) => order && !order.deadline) as OrdinalOrder[];

      return {
        ordinals,
        brc20
      };

      // Filter out empty orders that are not in pending state.
      // .filter((order) => !order.deadline)
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  return queryResult;
};

export { useGetActiveOrdinalOrders };
