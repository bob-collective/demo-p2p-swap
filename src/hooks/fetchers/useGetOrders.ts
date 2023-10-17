import { useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useGetAcceptedBtcOrders } from './useGetAcceptedBtcOrders';
import { useGetActiveBtcBuyOrders } from './useGetActiveBtcBuyOrders';
import { useGetActiveBtcSellOrders } from './useGetActiveBtcSellOrders';
import { useGetActiveErc20Orders } from './useGetActiveOrders';

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

  const refetch = useCallback(() => {
    refetchActiveErc20Orders();
    refetchBtcBuyOrders();
    refetchBtcSellOrders();
    refetchAcceptedBtcOrders();
  }, [refetchActiveErc20Orders, refetchBtcBuyOrders, refetchBtcSellOrders, refetchAcceptedBtcOrders]);

  const data = useMemo(() => {
    const orders = [
      ...(erc20Orders ? erc20Orders : []),
      ...(btcBuyOrders ? btcBuyOrders : []),
      ...(btcSellOrders ? btcSellOrders : [])
    ];

    return {
      owned: orders.filter((order) => order.isOwnerOfOrder),
      unowned: orders.filter((order) => !order.isOwnerOfOrder),
      acceptedBtc: {
        created: acceptedBtcOrders?.filter((order) => order.isCreatorOfOrder),
        accepted: acceptedBtcOrders?.filter((order) => order.isAcceptorOfOrder)
      }
    };
  }, [erc20Orders, btcBuyOrders, btcSellOrders, acceptedBtcOrders]);

  return {
    data,
    refetch,
    refetchActiveErc20Orders,
    refetchBtcBuyOrders,
    refetchBtcSellOrders,
    refetchAcceptedBtcOrders
  };
};

export { useGetOrders };
