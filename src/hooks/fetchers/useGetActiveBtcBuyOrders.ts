import { useQuery } from '@tanstack/react-query';
import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';
import { Bitcoin, ContractType } from '../../constants';
import { HexString } from '../../types';
import { BtcBuyOrder } from '../../types/orders';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { calculateOrderDeadline, calculateOrderPrice } from '../../utils/orders';
import { useContract } from '../useContract';
import { REFETCH_INTERVAL } from '../../constants/query';

const parseBtcBuyOrder = (
  rawOrder: {
    amountBtc: bigint;
    bitcoinAddress: {
      bitcoinAddress: string;
    };
    offeringToken: HexString;
    offeringAmount: bigint;
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
): BtcBuyOrder => {
  const acceptedOrder = orderAcceptances.find(({ orderId }) => orderId === id);
  const isOwnerOfOrder = !!address && isAddressEqual(rawOrder.requester, address);

  const offeringCurrency = getErc20CurrencyFromContractAddress(rawOrder.offeringToken);

  const price = calculateOrderPrice(rawOrder.offeringAmount, offeringCurrency, rawOrder.amountBtc, Bitcoin);

  const acceptedOrderPrice =
    acceptedOrder && calculateOrderPrice(acceptedOrder.ercAmount, offeringCurrency, acceptedOrder.amountBtc, Bitcoin);

  return {
    id,
    bitcoinAddress: rawOrder.bitcoinAddress.bitcoinAddress.toString(), // TODO: change when contract is updated to handle real address
    price: price || acceptedOrderPrice || 0,
    offeringCurrency,
    askingCurrency: Bitcoin,
    requesterAddress: rawOrder.requester,
    availableLiquidity: rawOrder.offeringAmount,
    totalAskingAmount: rawOrder.amountBtc,
    deadline: acceptedOrder?.acceptTime ? calculateOrderDeadline(acceptedOrder.acceptTime) : undefined,
    isOwnerOfOrder
  };
};

const useGetActiveBtcBuyOrders = () => {
  const { read: readBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);
  const { address } = useAccount();

  const queryResult = useQuery({
    queryKey: ['active-btc-buy-orders', address],
    enabled: !!readBtcMarketplace,
    queryFn: async () => {
      if (!readBtcMarketplace) return [];

      const [rawOrders, ordersIds] = await readBtcMarketplace('getOpenBtcBuyOrders');
      const [rawOrderAcceptances] = await readBtcMarketplace('getOpenAcceptedBtcBuyOrders');
      return (
        rawOrders
          .map((order, index) => parseBtcBuyOrder(order, address, ordersIds[index], rawOrderAcceptances))
          // Filter out empty orders that are not in pending state.
          .filter((order) => order.availableLiquidity > 0 || order.deadline)
      );
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  return queryResult;
};

export { useGetActiveBtcBuyOrders };
