import { useCallback, useEffect, useState } from 'react';
import { Bitcoin, ContractType } from '../../constants';
import { HexString } from '../../types';
import { AcceptedBtcOrder } from '../../types/orders';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { useContract } from '../useContract';
import { calculateOrderDeadline, calculateOrderPrice } from '../../utils/orders';
import { useAccount } from 'wagmi';
import { isAddressEqual } from 'viem';

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
  type: 'buy' | 'sell',
  address: HexString | undefined
): AcceptedBtcOrder => {
  const offeringCurrency = getErc20CurrencyFromContractAddress(rawOrder.ercToken);

  const price = calculateOrderPrice(
    rawOrder.ercAmount,
    offeringCurrency.decimals,
    rawOrder.amountBtc,
    Bitcoin.decimals
  );

  const deadline = calculateOrderDeadline(rawOrder.acceptTime);
  const ownerAddress = type === 'buy' ? rawOrder.accepter : rawOrder.requester;

  const isOwnerOfOrder = !!address && isAddressEqual(ownerAddress, address);

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
    bitcoinAddress: 'bc1ptEstAddress99skmssjd93deaDnteray',
    isOwnerOfOrder
  };
};

const useGetAcceptedBtcOrders = () => {
  const { read: readBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);
  const { address } = useAccount();

  const [acceptedBtcOrders, setBuyOrders] = useState<Array<AcceptedBtcOrder>>();

  const getBtcBuyOrders = useCallback(async () => {
    const [[rawBuyOrders, buyOrderIds], [rawSellOrders, sellOrderIds]] = await Promise.all([
      readBtcMarketplace.getOpenAcceptedBtcBuyOrders(),
      readBtcMarketplace.getOpenAcceptedBtcSellOrders()
    ]);

    const parsedBuyOrders = rawBuyOrders.map((order, index) =>
      parseAcceptedBtcOrder(order, buyOrderIds[index], 'buy', address)
    );
    const parsedSellOrders = rawSellOrders.map((order, index) =>
      parseAcceptedBtcOrder(order, sellOrderIds[index], 'sell', address)
    );
    setBuyOrders([...parsedBuyOrders, ...parsedSellOrders]);
  }, [readBtcMarketplace, address]);

  useEffect(() => {
    getBtcBuyOrders();
  }, [getBtcBuyOrders]);

  return { data: acceptedBtcOrders, refetch: getBtcBuyOrders };
};

export { useGetAcceptedBtcOrders };
