import { useCallback, useEffect, useState } from 'react';
import { ContractType } from '../../constants';
import { useContract } from '../useContract';
import { HexString } from '../../types';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { Erc20Order } from '../../types/orders';

const parseErc20Order = (rawOrder: {
  id: bigint;
  offeringAmount: bigint;
  offeringToken: HexString;
  askingAmount: bigint;
  askingToken: HexString;
  requesterAddress: HexString;
}): Erc20Order => {
  const { id, offeringAmount, offeringToken, askingAmount, askingToken, requesterAddress } = rawOrder;

  const offeringCurrency = getErc20CurrencyFromContractAddress(offeringToken);
  const askingCurrency = getErc20CurrencyFromContractAddress(askingToken);
  // TODO: make common util to handle decimal conversions or handle all monetary amounts in standalone class
  const price =
    Number(askingAmount) / 10 ** askingCurrency.decimals / (Number(offeringAmount) / 10 ** offeringCurrency.decimals);

  return {
    id,
    offeringCurrency,
    askingCurrency,
    requesterAddress,
    availableLiquidity: offeringAmount,
    price,
    totalAskingAmount: askingAmount
  };
};

const useGetActiveErc20Orders = () => {
  const [activeOrders, setActiveOrders] = useState<Array<Erc20Order>>();
  const { read: readErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);

  const fetchErc20Orders = useCallback(async () => {
    if (!readErc20Marketplace) return;
    const [rawOrders, identifiers] = await readErc20Marketplace.getOpenOrders();
    // !MEMO: Should use modified marketplace contract to return ID, this will start breaking when orders
    // get cancelled / totally filled.
    const orders = rawOrders.map((order, index) => parseErc20Order({ ...order, id: identifiers[index] }));
    setActiveOrders(orders);
  }, [setActiveOrders, readErc20Marketplace]);

  useEffect(() => {
    fetchErc20Orders();
  }, [fetchErc20Orders]);

  return { data: activeOrders, refetch: fetchErc20Orders };
};

export { useGetActiveErc20Orders };
export type { Erc20Order };
