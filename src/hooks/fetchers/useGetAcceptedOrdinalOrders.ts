import { useQuery } from '@tanstack/react-query';
import { ContractType } from '../../constants';

import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';
import { REFETCH_INTERVAL } from '../../constants/query';
import { HexString } from '../../types';
import { AcceptedBrc20Order, AcceptedOrdinalOrder, Utxo } from '../../types/orders';
import { getAddressFromScriptPubKey } from '../../utils/bitcoin';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { getBrc20Amount } from '../../utils/inscription';
import { calculateOrderDeadline, calculateOrderPrice } from '../../utils/orders';
import { useContract } from '../useContract';

type RawOrder = {
  ordinalID: { txId: `0x${string}`; index: number };
  sellToken: `0x${string}`;
  sellAmount: bigint;
  utxo: Utxo;
  requester: `0x${string}`;
};

type RawAcceptedOrder = {
  orderId: bigint;
  bitcoinAddress: {
    scriptPubKey: HexString;
  };
  ercToken: HexString;
  ercAmount: bigint;
  requester: HexString;
  acceptor: HexString;
  acceptTime: bigint;
};

const parseAcceptedOrdinalOrder = (
  rawOrder: RawOrder,
  rawAcceptedOrder: RawAcceptedOrder,
  id: bigint,
  address: HexString | undefined
): AcceptedOrdinalOrder => {
  const askingCurrency = getErc20CurrencyFromContractAddress(rawAcceptedOrder.ercToken);

  const deadline = calculateOrderDeadline(rawAcceptedOrder.acceptTime);

  const isAcceptorOfOrder = !!address && isAddressEqual(rawAcceptedOrder.acceptor, address);
  const isCreatorOfOrder = !!address && isAddressEqual(rawAcceptedOrder.requester, address);

  const bitcoinAddress = rawAcceptedOrder.bitcoinAddress;
  if (!bitcoinAddress?.scriptPubKey) {
    throw new Error('Bitcoin address not found');
  }

  return {
    acceptId: id,
    orderId: rawAcceptedOrder.orderId,
    ordinalId: rawOrder.ordinalID,
    deadline,
    askingCurrency,
    totalAskingAmount: rawAcceptedOrder.ercAmount,
    buyerBitcoinAddress: getAddressFromScriptPubKey(bitcoinAddress.scriptPubKey),
    isAcceptorOfOrder,
    isCreatorOfOrder,
    utxo: rawOrder.utxo
  };
};

const parseBrc20Order = async (
  rawOrder: RawOrder,
  rawAcceptedOrder: RawAcceptedOrder,
  id: bigint,
  address: HexString | undefined
): Promise<AcceptedBrc20Order> => {
  const order = parseAcceptedOrdinalOrder(rawOrder, rawAcceptedOrder, id, address);

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
const useGetAcceptedOrdinalOrders = () => {
  const { read: readOrdinalMarketplace } = useContract(ContractType.ORD_MARKETPLACE);
  const { address } = useAccount();

  const queryResult = useQuery({
    queryKey: ['accepted-ordinal-orders', address],
    enabled: !!readOrdinalMarketplace,
    queryFn: async () => {
      const [[rawOrders, ordersIds], [rawOrderAcceptances, acceptIds]] = await Promise.all([
        readOrdinalMarketplace.getOpenOrdinalSellOrders(),
        readOrdinalMarketplace.getOpenAcceptedOrdinalSellOrders()
      ]);

      const brc20 = (
        await Promise.all(
          rawOrderAcceptances.map(async (order, index) => {
            const orderId = ordersIds.findIndex((id) => id === order.orderId);

            const activeOrder = rawOrders[orderId];

            const isBrc20 = !!(await getBrc20Amount(activeOrder.ordinalID));

            return isBrc20 ? await parseBrc20Order(rawOrders[orderId], order, acceptIds[index], address) : undefined;
          })
        )
      ).filter(Boolean) as AcceptedBrc20Order[];

      const ordinals = (
        await Promise.all(
          rawOrderAcceptances.map(async (order, index) => {
            const orderId = ordersIds.findIndex((id) => id === order.orderId);

            const activeOrder = rawOrders[orderId];

            const isBrc20 = !!(await getBrc20Amount(activeOrder.ordinalID));

            return isBrc20
              ? undefined
              : parseAcceptedOrdinalOrder(rawOrders[orderId], order, acceptIds[index], address);
          })
        )
      ).filter(Boolean) as AcceptedBrc20Order[];

      return {
        ordinals,
        brc20
      };
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  return queryResult;
};

export { useGetAcceptedOrdinalOrders };
