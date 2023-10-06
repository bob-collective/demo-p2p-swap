import { BTC_ACCEPT_REQUEST_EXPIRATION_SECONDS } from '../constants/orders';
import { Order, BtcOrder, BtcBuyOrder, BtcSellOrder, Erc20Order } from '../types/orders';
import { isBitcoinCurrency, isErc20Currency } from './currencies';

const isErc20Order = (order: Order): order is Erc20Order =>
  isErc20Currency(order.askingCurrency) && isErc20Currency(order.offeringCurrency);

const isBtcBuyOrder = (order: Order): order is BtcBuyOrder => isBitcoinCurrency(order.askingCurrency);

const isBtcSellOrder = (order: Order): order is BtcSellOrder => isBitcoinCurrency(order.offeringCurrency);

const isBtcOrder = (order: Order): order is BtcOrder => isBtcBuyOrder(order) || isBtcSellOrder(order);

const calculateOrderDeadline = (acceptTime: bigint): Date =>
  new Date((Number(acceptTime) + BTC_ACCEPT_REQUEST_EXPIRATION_SECONDS) * 1000);

const calculateOrderPrice = (
  offeringAmount: bigint,
  offeringDecimals: number,
  askingAmount: bigint,
  askingDecimals: number
) => Number(askingAmount) / 10 ** askingDecimals / (Number(offeringAmount) / 10 ** offeringDecimals);

export { isBtcBuyOrder, isBtcOrder, isBtcSellOrder, isErc20Order, calculateOrderDeadline, calculateOrderPrice };
