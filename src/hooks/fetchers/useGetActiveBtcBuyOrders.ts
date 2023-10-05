import { useCallback, useEffect, useState } from 'react';
import { useContract } from '../useContract';
import { Bitcoin, ContractType } from '../../constants';
import { BtcBuyOrder } from '../../types/orders';
import { HexString } from '../../types';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { useAccount } from 'wagmi';
import { isAddressEqual } from 'viem';

const parseBtcBuyOrder = (
  rawOrder: {
    amountBtc: bigint;
    bitcoinAddress: {
      bitcoinAddress: bigint;
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
  }[]
): BtcBuyOrder => {
  const acceptedOrder = orderAcceptances.find(({ orderId }) => orderId === id);
  const isOwnerOfOrder = !!address && isAddressEqual(rawOrder.requester, address);

  const offeringCurrency = getErc20CurrencyFromContractAddress(rawOrder.offeringToken);
  const price =
    Number(rawOrder.amountBtc) /
    10 ** Bitcoin.decimals /
    (Number(rawOrder.offeringAmount) / 10 ** offeringCurrency.decimals);

  return {
    id,
    bitcoinAddress: rawOrder.bitcoinAddress.bitcoinAddress.toString(), // TODO: change when contract is updated to handle real address
    price,
    offeringCurrency,
    askingCurrency: Bitcoin,
    requesterAddress: rawOrder.requester,
    availableLiquidity: rawOrder.offeringAmount,
    totalAskingAmount: rawOrder.amountBtc,
    acceptTime: acceptedOrder?.acceptTime,
    isOwnerOfOrder
  };
};

const useGetActiveBtcBuyOrders = () => {
  const { read: readBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);

  const [buyOrders, setBuyOrders] = useState<Array<BtcBuyOrder>>();
  const { address } = useAccount();

  const getBtcBuyOrders = useCallback(async () => {
    const [rawOrders, ordersIds] = await readBtcMarketplace.getOpenBtcBuyOrders();
    const [rawOrderAcceptances] = await readBtcMarketplace.getOpenAcceptedBtcBuyOrders();
    const parsedOrders = rawOrders
      .map((order, index) => parseBtcBuyOrder(order, address, ordersIds[index], rawOrderAcceptances))
      // Filter out empty orders that are not in pending state.
      .filter((order) => order.availableLiquidity > 0 || order.acceptTime);
    setBuyOrders(parsedOrders);
  }, [readBtcMarketplace, address]);

  useEffect(() => {
    getBtcBuyOrders();
  }, [getBtcBuyOrders]);

  return { data: buyOrders, refetch: getBtcBuyOrders };
};

export { useGetActiveBtcBuyOrders };
