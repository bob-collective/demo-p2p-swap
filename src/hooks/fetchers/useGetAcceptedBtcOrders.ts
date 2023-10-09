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
    bitcoinAddress?: {
      bitcoinAddress: string;
    };
  },
  id: bigint,
  type: 'buy' | 'sell',
  address: HexString | undefined,
  underlyingBuyOrders: readonly {
    bitcoinAddress: {
      bitcoinAddress: string;
    };
  }[],
  buyids: readonly bigint[]
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

  const underlyingBtcAddress = underlyingBuyOrders.find((_, index) => buyids[index] === rawOrder.orderId);
  const bitcoinAddress = rawOrder.bitcoinAddress || underlyingBtcAddress?.bitcoinAddress;
  if (!bitcoinAddress?.bitcoinAddress) {
    throw new Error('Bitcoin address not found');
  }

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
    bitcoinAddress: bitcoinAddress?.bitcoinAddress,
    isOwnerOfOrder
  };
};

const useGetAcceptedBtcOrders = () => {
  const { read: readBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);
  const { address } = useAccount();

  const [acceptedBtcOrders, setBuyOrders] = useState<Array<AcceptedBtcOrder>>();

  const getBtcBuyOrders = useCallback(async () => {
    const [[rawBuyOrders, buyOrderIds], [rawSellOrders, sellOrderIds], [rawUnderlyingBuyOrders, underlyingBuyIds]] =
      await Promise.all([
        readBtcMarketplace.getOpenAcceptedBtcBuyOrders(),
        readBtcMarketplace.getOpenAcceptedBtcSellOrders(),
        readBtcMarketplace.getOpenBtcBuyOrders()
      ]);

    const parsedBuyOrders = rawBuyOrders.map((order, index) =>
      parseAcceptedBtcOrder(order, buyOrderIds[index], 'buy', address, rawUnderlyingBuyOrders, underlyingBuyIds)
    );
    const parsedSellOrders = rawSellOrders.map((order, index) =>
      parseAcceptedBtcOrder(order, sellOrderIds[index], 'sell', address, rawUnderlyingBuyOrders, underlyingBuyIds)
    );
    setBuyOrders([...parsedBuyOrders, ...parsedSellOrders]);
  }, [readBtcMarketplace, address]);

  useEffect(() => {
    getBtcBuyOrders();
  }, [getBtcBuyOrders]);

  return { data: acceptedBtcOrders, refetch: getBtcBuyOrders };
};

export { useGetAcceptedBtcOrders };
