import { useCallback, useEffect, useState } from 'react';
import { useContract } from '../useContract';
import { Bitcoin, ContractType } from '../../constants';
import { BtcBuyOrder } from '../../types/orders';
import { HexString } from '../../types';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';

const parsePendingBtcOrders = (
  rawOrder: {
    amountBtc: bigint;
    bitcoinAddress: {
      bitcoinAddress: bigint;
    };
    offeringToken: HexString;
    offeringAmount: bigint;
    requester: HexString;
  },
  id: bigint,
  orderAcceptances: readonly {
    orderId: bigint;
    acceptTime: bigint;
  }[]
): BtcBuyOrder => {
  const acceptedOrder = orderAcceptances.find(({ orderId }) => orderId === id);

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
    acceptTime: acceptedOrder?.acceptTime
  };
};

const useGetActiveBtcBuyOrders = () => {
  const { read: readBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);

  const [buyOrders, setBuyOrders] = useState<Array<BtcBuyOrder>>();

  const getBtcBuyOrders = useCallback(async () => {
    const [rawOrders, ordersIds] = await readBtcMarketplace.getOpenAcceptedBtcBuyOrders();
    const parsedOrders = rawOrders.map((order, index) => parsePendingBtcOrders(order, ordersIds[index]));
    setBuyOrders(parsedOrders);
  }, [readBtcMarketplace]);

  useEffect(() => {
    getBtcBuyOrders();
  }, [getBtcBuyOrders]);

  return { data: buyOrders, refetch: getBtcBuyOrders };
};

export { useGetActiveBtcBuyOrders };
