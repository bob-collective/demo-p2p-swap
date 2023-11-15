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

  const {
    data: erc20Orders,
    refetch: refetchActiveErc20Orders,
    isLoading: isLoadingActiveErc20Orders
  } = useGetActiveErc20Orders();
  const {
    data: btcBuyOrders,
    refetch: refetchBtcBuyOrders,
    isLoading: isLoadingBtcBuyOrders
  } = useGetActiveBtcBuyOrders();
  const {
    data: btcSellOrders,
    refetch: refetchBtcSellOrders,
    isLoading: isLoadingBtcSellOrders
  } = useGetActiveBtcSellOrders();
  const {
    data: acceptedBtcOrders,
    refetch: refetchAcceptedBtcOrders,
    isLoading: isLoadingAcceptedBtcOrders
  } = useGetAcceptedBtcOrders();

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

  const isLoading =
    isLoadingActiveErc20Orders || isLoadingBtcBuyOrders || isLoadingBtcSellOrders || isLoadingAcceptedBtcOrders;

  return {
    data,
    isLoading,
    refetch,
    refetchActiveErc20Orders,
    refetchBtcBuyOrders,
    refetchBtcSellOrders,
    refetchAcceptedBtcOrders
  };
};

export { useGetOrders };
