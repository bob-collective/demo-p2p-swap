import { useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useGetAcceptedBtcOrders } from './useGetAcceptedBtcOrders';
import { useGetActiveBtcBuyOrders } from './useGetActiveBtcBuyOrders';
import { useGetActiveBtcSellOrders } from './useGetActiveBtcSellOrders';
import { useGetActiveErc20Orders } from './useGetActiveOrders';
import { useGetAcceptedOrdinalOrders } from './useGetAcceptedOrdinalOrders';
import { useGetActiveOrdinalOrders } from './useGetActiveOrdinalOrders';

const useGetOrders = () => {
  useAccount({
    onConnect: () => {
      refetch();
    },
    onDisconnect: () => {
      refetch();
    }
  });

  const { data: erc20Orders, refetch: refetchActiveErc20Orders } = useGetActiveErc20Orders();
  const { data: btcBuyOrders, refetch: refetchBtcBuyOrders } = useGetActiveBtcBuyOrders();
  const { data: btcSellOrders, refetch: refetchBtcSellOrders } = useGetActiveBtcSellOrders();
  const { data: acceptedBtcOrders, refetch: refetchAcceptedBtcOrders } = useGetAcceptedBtcOrders();

  const { data: acceptedOrdinalOrders, refetch: refetchAcceptedOrdinalOrders } = useGetAcceptedOrdinalOrders();
  const { data: activeOrdinalOrders, refetch: refetchActiveOrdinalOrders } = useGetActiveOrdinalOrders();

  const refetch = useCallback(() => {
    refetchActiveErc20Orders();
    refetchBtcBuyOrders();
    refetchBtcSellOrders();
    refetchAcceptedBtcOrders();
    refetchAcceptedOrdinalOrders();
    refetchActiveOrdinalOrders();
  }, [
    refetchActiveErc20Orders,
    refetchBtcBuyOrders,
    refetchBtcSellOrders,
    refetchAcceptedBtcOrders,
    refetchAcceptedOrdinalOrders,
    refetchActiveOrdinalOrders
  ]);

  const data = useMemo(() => {
    const orders = [
      ...(erc20Orders ? erc20Orders : []),
      ...(btcBuyOrders ? btcBuyOrders : []),
      ...(btcSellOrders ? btcSellOrders : [])
    ];

    const activeOrdOrders = (activeOrdinalOrders || []).filter(({ deadline }) => !deadline);

    return {
      owned: orders.filter((order) => order.isOwnerOfOrder),
      unowned: orders.filter((order) => !order.isOwnerOfOrder),
      acceptedBtc: {
        created: acceptedBtcOrders?.filter((order) => order.isCreatorOfOrder),
        accepted: acceptedBtcOrders?.filter((order) => order.isAcceptorOfOrder)
      },
      ordinal: {
        owned: activeOrdOrders.filter((order) => order.isOwnerOfOrder),
        unowned: activeOrdOrders.filter((order) => !order.isOwnerOfOrder),
        accepted: {
          created: (acceptedOrdinalOrders || [])?.filter((order) => order.isCreatorOfOrder),
          accepted: (acceptedOrdinalOrders || [])?.filter((order) => order.isAcceptorOfOrder)
        }
      }
    };
  }, [erc20Orders, btcBuyOrders, btcSellOrders, acceptedBtcOrders, activeOrdinalOrders, acceptedOrdinalOrders]);

  return {
    data,
    refetch,
    refetchActiveErc20Orders,
    refetchBtcBuyOrders,
    refetchBtcSellOrders,
    refetchAcceptedBtcOrders,
    refetchAcceptedOrdinalOrders,
    refetchActiveOrdinalOrders
  };
};

export { useGetOrders };
