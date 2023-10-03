import { useCallback, useEffect, useState } from 'react';
import { useContract } from '../useContract';
import { Bitcoin, ContractType } from '../../constants';
import { BtcBuyOrder } from '../../types/orders';
import { HexString } from '../../types';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';

const parseBtcBuyOrder = (
  rawOrder: {
    amountBtc: bigint;
    bitcoinAddress: {
      bitcoinAddress: bigint;
    };
    offeringToken: HexString;
    offeringAmount: bigint;
    requester: HexString;
  },
  id: bigint
): BtcBuyOrder => {
  const offeringCurrency = getErc20CurrencyFromContractAddress(rawOrder.offeringToken);
  const price =
    Number(rawOrder.amountBtc) /
    10 ** Bitcoin.decimals /
    (Number(rawOrder.offeringAmount) / 10 ** offeringCurrency.decimals);

  return {
    id,
    bitcoinAddress: rawOrder.bitcoinAddress.bitcoinAddress.toString(), // TODO: change when contract is updated to handle real address
    price,
    offeringCurrency,
    askingCurrency: Bitcoin,
    requesterAddress: rawOrder.requester,
    availableLiquidity: rawOrder.amountBtc
  };
};

const useGetActiveBtcBuyOrders = () => {
  const { read: readBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);

  const [buyOrders, setBuyOrders] = useState<Array<BtcBuyOrder>>();

  const getBtcBuyOrders = useCallback(async () => {
    const [rawOrders, ids] = await readBtcMarketplace.getOpenBtcBuyOrders();
    const parsedOrders = rawOrders.map((order, index) => parseBtcBuyOrder(order, ids[index]));
    setBuyOrders(parsedOrders);
  }, [readBtcMarketplace]);

  useEffect(() => {
    getBtcBuyOrders();
  }, [getBtcBuyOrders]);

  return { data: buyOrders, refetch: getBtcBuyOrders };
};

export { useGetActiveBtcBuyOrders };
