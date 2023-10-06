import { useCallback, useEffect, useState } from 'react';
import { useContract } from '../useContract';
import { Bitcoin, ContractType } from '../../constants';
import { BtcSellOrder } from '../../types/orders';
import { HexString } from '../../types';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { useAccount } from 'wagmi';
import { isAddressEqual } from 'viem';
import { calculateOrderDeadline, calculateOrderPrice } from '../../utils/orders';

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

  const price = calculateOrderPrice(
    rawOrder.amountBtc,
    Bitcoin.decimals,
    rawOrder.askingAmount,
    askingCurrency.decimals
  );

  const acceptedOrderPrice =
    acceptedOrder &&
    calculateOrderPrice(acceptedOrder.amountBtc, Bitcoin.decimals, acceptedOrder.ercAmount, askingCurrency.decimals);

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

  const [sellOrders, setSellOrders] = useState<Array<BtcSellOrder>>();
  const { address } = useAccount();

  const getBtcBuyOrders = useCallback(async () => {
    const [[rawOrders, ordersIds], [rawOrderAcceptances]] = await Promise.all([
      readBtcMarketplace.getOpenBtcSellOrders(),
      readBtcMarketplace.getOpenAcceptedBtcSellOrders()
    ]);
    const parsedOrders = rawOrders
      .map((order, index) => parseBtcSellOrder(order, address, ordersIds[index], rawOrderAcceptances))
      // Filter out empty orders that are not in pending state.
      .filter((order) => order.availableLiquidity > 0 || order.deadline);
    setSellOrders(parsedOrders);
  }, [readBtcMarketplace, address]);

  useEffect(() => {
    getBtcBuyOrders();
  }, [getBtcBuyOrders]);

  return { data: sellOrders, refetch: getBtcBuyOrders };
};

export { useGetActiveBtcSellOrders };
