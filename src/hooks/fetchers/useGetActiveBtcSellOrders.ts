import { useQuery } from '@tanstack/react-query';
import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';
import { Bitcoin, ContractType } from '../../constants';
import { HexString } from '../../types';
import { BtcSellOrder } from '../../types/orders';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { calculateOrderDeadline, calculateOrderPrice } from '../../utils/orders';
import { useContract } from '../useContract';
import { REFETCH_INTERVAL } from '../../constants/query';

const parseBtcSellOrder = (
  rawOrder: {
    amountBtc: bigint;
    askingToken: HexString;
    askingAmount: bigint;
    requester: HexString;
  },
  address: HexString | undefined,
  id: bigint,
  orderAcceptances: readonly {
    orderId: bigint;
    acceptTime: bigint;
    amountBtc: bigint;
    ercAmount: bigint;
  }[]
): BtcSellOrder => {
  const acceptedOrder = orderAcceptances.find(({ orderId }) => orderId === id);
  const isOwnerOfOrder = !!address && isAddressEqual(rawOrder.requester, address);

  const askingCurrency = getErc20CurrencyFromContractAddress(rawOrder.askingToken);

  const price = calculateOrderPrice(rawOrder.amountBtc, Bitcoin, rawOrder.askingAmount, askingCurrency);

  const acceptedOrderPrice =
    acceptedOrder && calculateOrderPrice(acceptedOrder.amountBtc, Bitcoin, acceptedOrder.ercAmount, askingCurrency);

  return {
    id,
    price: price || acceptedOrderPrice || 0,
    offeringCurrency: Bitcoin,
    askingCurrency: askingCurrency,
    requesterAddress: rawOrder.requester,
    availableLiquidity: rawOrder.amountBtc,
    totalAskingAmount: rawOrder.askingAmount,
    deadline: acceptedOrder?.acceptTime ? calculateOrderDeadline(acceptedOrder.acceptTime) : undefined,
    isOwnerOfOrder
  };
};

const useGetActiveBtcSellOrders = () => {
  const { read: readBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);
  const { address } = useAccount();

  const queryResult = useQuery({
    queryKey: ['active-btc-sell-orders', address],
    enabled: !!readBtcMarketplace,
    queryFn: async () => {
      const [[rawOrders, ordersIds], [rawOrderAcceptances]] = await Promise.all([
        readBtcMarketplace.getOpenBtcSellOrders(),
        readBtcMarketplace.getOpenAcceptedBtcSellOrders()
      ]);
      return (
        rawOrders
          .map((order, index) => parseBtcSellOrder(order, address, ordersIds[index], rawOrderAcceptances))
          // Filter out empty orders that are not in pending state.
          .filter((order) => order.availableLiquidity > 0 && !order.deadline)
      );
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  return queryResult;
};

export { useGetActiveBtcSellOrders };
