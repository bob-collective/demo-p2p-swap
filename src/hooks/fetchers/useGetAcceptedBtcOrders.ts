import { useCallback, useEffect, useState } from 'react';
import { Bitcoin, ContractType } from '../../constants';
import { HexString } from '../../types';
import { AcceptedBtcOrder } from '../../types/orders';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { useContract } from '../useContract';
import { calculateOrderDeadline, calculateOrderPrice } from '../../utils/orders';

const parseAcceptedBtcOrder = (
  rawOrder: {
    orderId: bigint;
    acceptTime: bigint;
    amountBtc: bigint;
    ercToken: HexString;
    ercAmount: bigint;
    accepter: HexString;
    requester: HexString;
  },
  id: bigint,
  type: 'buy' | 'sell'
): AcceptedBtcOrder => {
  const offeringCurrency = getErc20CurrencyFromContractAddress(rawOrder.ercToken);

  const price = calculateOrderPrice(
    rawOrder.ercAmount,
    offeringCurrency.decimals,
    rawOrder.amountBtc,
    Bitcoin.decimals
  );

  const deadline = calculateOrderDeadline(rawOrder.acceptTime);

  return {
    type,
    acceptId: id,
    orderId: rawOrder.orderId,
    price,
    amountBtc: rawOrder.amountBtc,
    otherCurrency: offeringCurrency,
    btcReceiver: type === 'buy' ? rawOrder.requester : rawOrder.accepter,
    btcSender: type === 'buy' ? rawOrder.accepter : rawOrder.requester,
    deadline,
    otherCurrencyAmount: rawOrder.ercAmount,
    bitcoinAddress: 'bc1ptEstAddress99skmssjd93deaDnteray'
  };
};

const useGetAcceptedBtcOrders = () => {
  const { read: readBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);

  const [acceptedBtcOrders, setBuyOrders] = useState<Array<AcceptedBtcOrder>>();

  const getBtcBuyOrders = useCallback(async () => {
    const [[rawBuyOrders, buyOrderIds], [rawSellOrders, sellOrderIds]] = await Promise.all([
      readBtcMarketplace.getOpenAcceptedBtcBuyOrders(),
      readBtcMarketplace.getOpenAcceptedBtcSellOrders()
    ]);

    const parsedBuyOrders = rawBuyOrders.map((order, index) => parseAcceptedBtcOrder(order, buyOrderIds[index], 'buy'));
    const parsedSellOrders = rawSellOrders.map((order, index) =>
      parseAcceptedBtcOrder(order, sellOrderIds[index], 'sell')
    );
    setBuyOrders([...parsedBuyOrders, ...parsedSellOrders]);
  }, [readBtcMarketplace]);

  useEffect(() => {
    getBtcBuyOrders();
  }, [getBtcBuyOrders]);

  return { data: acceptedBtcOrders, refetch: getBtcBuyOrders };
};

export { useGetAcceptedBtcOrders };
