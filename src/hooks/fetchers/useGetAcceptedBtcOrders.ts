import { useCallback, useEffect, useState } from 'react';
import { Bitcoin, ContractType } from '../../constants';
import { HexString } from '../../types';
import { AcceptedBtcOrder } from '../../types/orders';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { useContract } from '../useContract';
import { BTC_ACCEPT_REQUEST_EXPIRATION_SECONDS } from '../../constants/orders';

const parseBtcBuyOrder = (
  rawOrder: {
    orderId: bigint;
    acceptTime: bigint;
    amountBtc: bigint;
    ercToken: HexString;
    ercAmount: bigint;
    accepter: HexString;
    requester: HexString;
  },
  id: bigint
): AcceptedBtcOrder => {
  const offeringCurrency = getErc20CurrencyFromContractAddress(rawOrder.ercToken);
  const price =
    Number(rawOrder.amountBtc) /
    10 ** Bitcoin.decimals /
    (Number(rawOrder.ercAmount) / 10 ** offeringCurrency.decimals);

  const deadline = new Date((Number(rawOrder.acceptTime) + BTC_ACCEPT_REQUEST_EXPIRATION_SECONDS) * 1000);

  return {
    type: 'buy',
    acceptId: id,
    orderId: rawOrder.orderId,
    price,
    amountBtc: rawOrder.amountBtc,
    otherCurrency: offeringCurrency,
    btcReceiver: rawOrder.requester,
    btcSender: rawOrder.accepter,
    deadline,
    otherCurrencyAmount: rawOrder.ercAmount,
    bitcoinAddress: 'bc1ptEstAddress99skmssjd93deaDnteray'
  };
};

const useGetAcceptedBtcOrders = () => {
  const { read: readBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);

  const [acceptedBtcOrders, setBuyOrders] = useState<Array<AcceptedBtcOrder>>();

  const getBtcBuyOrders = useCallback(async () => {
    const [rawOrders, ids] = await readBtcMarketplace.getOpenAcceptedBtcBuyOrders();

    const parsedOrders = rawOrders.map((order, index) => parseBtcBuyOrder(order, ids[index]));
    setBuyOrders(parsedOrders);
  }, [readBtcMarketplace]);

  useEffect(() => {
    getBtcBuyOrders();
  }, [getBtcBuyOrders]);

  return { data: acceptedBtcOrders, refetch: getBtcBuyOrders };
};

export { useGetAcceptedBtcOrders };
