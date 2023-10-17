import { useQuery } from '@tanstack/react-query';
import { Bitcoin, ContractType } from '../../constants';

import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';
import { HexString } from '../../types';
import { AcceptedBtcOrder } from '../../types/orders';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { calculateOrderDeadline, calculateOrderPrice } from '../../utils/orders';
import { useContract } from '../useContract';
import { REFETCH_INTERVAL } from '../../constants/query';

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

  const price = calculateOrderPrice(rawOrder.ercAmount, offeringCurrency, rawOrder.amountBtc, Bitcoin);

  const deadline = calculateOrderDeadline(rawOrder.acceptTime);

  const isAcceptorOfOrder = !!address && isAddressEqual(rawOrder.accepter, address);
  const isCreatorOfOrder = !!address && isAddressEqual(rawOrder.requester, address);

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
    isAcceptorOfOrder,
    isCreatorOfOrder
  };
};

const useGetAcceptedBtcOrders = () => {
  const { read: readBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);
  const { address } = useAccount();

  const queryResult = useQuery({
    queryKey: ['accepted-btc-orders', address],
    enabled: !!readBtcMarketplace,
    queryFn: async () => {
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

      return [...parsedBuyOrders, ...parsedSellOrders];
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  return queryResult;
};

export { useGetAcceptedBtcOrders };
