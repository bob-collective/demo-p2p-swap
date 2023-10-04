import { useCallback, useEffect, useState } from 'react';
import { Bitcoin, ContractType } from '../../constants';
import { HexString } from '../../types';
import { AcceptedBuyOrder } from '../../types/orders';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { useContract } from '../useContract';

const parseBtcBuyOrder = (
  rawOrder: {
    acceptTime: bigint;
    amountBtc: bigint;
    ercToken: HexString;
    ercAmount: bigint;
    accepter: HexString;
    requester: HexString;
  },
  id: bigint
): AcceptedBuyOrder => {
  const offeringCurrency = getErc20CurrencyFromContractAddress(rawOrder.ercToken);
  const price =
    Number(rawOrder.amountBtc) /
    10 ** Bitcoin.decimals /
    (Number(rawOrder.ercAmount) / 10 ** offeringCurrency.decimals);

  const acceptTime = new Date(Number(rawOrder.acceptTime) * 1000);

  return {
    id,
    price,
    offeringCurrency,
    askingCurrency: Bitcoin,
    requesterAddress: rawOrder.requester,
    amount: rawOrder.amountBtc,
    accepterAddress: rawOrder.accepter,
    acceptTime
  };
};

const useGetAcceptedBtcBuyOrders = () => {
  const { read: readBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);

  const [buyOrders, setBuyOrders] = useState<Array<AcceptedBuyOrder>>();

  const getBtcBuyOrders = useCallback(async () => {
    const [rawOrders, ids] = await readBtcMarketplace.getOpenAcceptedBtcBuyOrders();

    const parsedOrders = rawOrders.map((order, index) => parseBtcBuyOrder(order, ids[index]));
    setBuyOrders(parsedOrders);
  }, [readBtcMarketplace]);

  useEffect(() => {
    getBtcBuyOrders();
  }, [getBtcBuyOrders]);

  return { data: buyOrders, refetch: getBtcBuyOrders };
};

export { useGetAcceptedBtcBuyOrders };
