import { Currency } from '../constants';
import { BTC_ACCEPT_REQUEST_EXPIRATION_SECONDS } from '../constants/orders';
import { Order, BtcOrder, BtcBuyOrder, BtcSellOrder, Erc20Order } from '../types/orders';
import { Amount } from './amount';
import { isBitcoinCurrency, isErc20Currency } from './currencies';

const isErc20Order = (order: Order): order is Erc20Order =>
  isErc20Currency(order.askingCurrency) &&
  (order as Erc20Order)?.offeringCurrency &&
  isErc20Currency((order as Erc20Order).offeringCurrency);

const isBtcBuyOrder = (order: Order): order is BtcBuyOrder => isBitcoinCurrency(order.askingCurrency);

const isBtcSellOrder = (order: Order): order is BtcSellOrder =>
  (order as Erc20Order)?.offeringCurrency &&
  isBitcoinCurrency((order as Erc20Order).offeringCurrency) &&
  isErc20Currency((order as Erc20Order).offeringCurrency);

const isBtcOrder = (order: Order): order is BtcOrder => isBtcBuyOrder(order) || isBtcSellOrder(order);

const calculateOrderDeadline = (acceptTime: bigint): Date =>
  new Date((Number(acceptTime) + BTC_ACCEPT_REQUEST_EXPIRATION_SECONDS) * 1000);

const calculateOrderPrice = (
  offeringAmount: bigint,
  offeringCurrency: Currency,
  askingAmount: bigint,
  askingCurrency: Currency
) => {
  const asking = new Amount(askingCurrency, Number(askingAmount)).toBig();

  if (asking.lte(0)) return 0;

  return asking.div(new Amount(offeringCurrency, Number(offeringAmount)).toBig()).toNumber();
};

export { isBtcBuyOrder, isBtcOrder, isBtcSellOrder, isErc20Order, calculateOrderDeadline, calculateOrderPrice };
