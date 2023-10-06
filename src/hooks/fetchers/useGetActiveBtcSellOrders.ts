import { useCallback, useEffect, useState } from 'react';
import { useContract } from '../useContract';
import { Bitcoin, ContractType } from '../../constants';
import { BtcSellOrder } from '../../types/orders';
import { HexString } from '../../types';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { useAccount } from 'wagmi';
import { isAddressEqual } from 'viem';

const parseBtcSellOrder = (
  rawOrder: {
    amountBtc: bigint;
    askingToken: HexString;
    askingAmount: bigint;
    requester: HexString;
  },
  address: HexString | undefined,
  id: bigint
): BtcSellOrder => {
  const isOwnerOfOrder = !!address && isAddressEqual(rawOrder.requester, address);

  const askingCurrency = getErc20CurrencyFromContractAddress(rawOrder.askingToken);
  const price =
    Number(rawOrder.amountBtc) /
    10 ** Bitcoin.decimals /
    (Number(rawOrder.askingAmount) / 10 ** offeringCurrency.decimals);

  return {
    id,
    price,
    offeringCurrency: Bitcoin,
    askingCurrency: offeringCurrency,
    requesterAddress: rawOrder.requester,
    availableLiquidity: rawOrder.askingAmount,
    totalAskingAmount: rawOrder.amountBtc,
    isOwnerOfOrder
  };
};

const useGetActiveBtcSellOrders = () => {
  const { read: readBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);

  const [sellOrders, setSellOrders] = useState<Array<BtcSellOrder>>();
  const { address } = useAccount();

  const getBtcBuyOrders = useCallback(async () => {
    const [rawOrders, ordersIds] = await readBtcMarketplace.getOpenBtcSellOrders();

    const parsedOrders = rawOrders
      .map((order, index) => parseBtcSellOrder(order, address, ordersIds[index]))
      // Filter out empty orders that are not in pending state.
      .filter((order) => order.availableLiquidity > 0);
    setSellOrders(parsedOrders);
  }, [readBtcMarketplace, address]);

  useEffect(() => {
    getBtcBuyOrders();
  }, [getBtcBuyOrders]);

  return { data: sellOrders, refetch: getBtcBuyOrders };
};

export { useGetActiveBtcSellOrders };
