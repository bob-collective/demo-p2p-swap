import { BitcoinCurrency, Brc20Currency, Currency, Erc20Currency } from '../constants';
import { Amount } from '../utils/amount';
import { HexString } from './common';

interface BaseOrder {
  id: bigint;
  offeringCurrency: Currency;
  askingCurrency: Currency;
  price: number; // Price per unit of asking token.
  availableLiquidity: bigint; // Amount in offering token.
  totalAskingAmount: bigint; // Amount in asking token.
  requesterAddress: HexString;
  isOwnerOfOrder: boolean;
}

interface Erc20Order extends BaseOrder {
  offeringCurrency: Erc20Currency;
  askingCurrency: Erc20Currency;
}

interface BtcBuyOrder extends BaseOrder {
  offeringCurrency: Erc20Currency;
  askingCurrency: BitcoinCurrency;
  bitcoinAddress: string;
  deadline: Date | undefined; // If undefined then order has not been accepted.
}

interface BtcSellOrder extends BaseOrder {
  offeringCurrency: BitcoinCurrency;
  askingCurrency: Erc20Currency;
  deadline: Date | undefined; // If undefined then order has not been accepted.
}

interface AcceptedBtcOrder {
  acceptId: bigint;
  orderId: bigint;
  deadline: Date;
  amountBtc: bigint;
  price: number;
  otherCurrency: Currency;
  otherCurrencyAmount: bigint;
  bitcoinAddress: string;
  btcReceiver: HexString;
  btcSender: HexString;
  type: 'buy' | 'sell';
  isAcceptorOfOrder: boolean;
  isCreatorOfOrder: boolean;
}

type Utxo = { txHash: HexString; txOutputIndex: number; txOutputValue: bigint };

interface OrdinalOrder {
  id: bigint;
  ordinalId: { txId: HexString; index: number };
  utxo: Utxo;
  askingCurrency: Erc20Currency;
  totalAskingAmount: bigint;
  deadline: Date | undefined;
  isOwnerOfOrder: boolean;
}

interface Brc20Order extends OrdinalOrder {
  amount: Amount<Brc20Currency>;
  price: number;
}

interface AcceptedOrdinalOrder {
  orderId: bigint;
  acceptId: bigint;
  ordinalId: { txId: HexString; index: number };
  deadline: Date;
  askingCurrency: Erc20Currency;
  totalAskingAmount: bigint;
  buyerBitcoinAddress: string;
  isAcceptorOfOrder: boolean;
  isCreatorOfOrder: boolean;
  utxo: Utxo;
}

interface AcceptedBrc20Order extends AcceptedOrdinalOrder {
  amount: Amount<Brc20Currency>;
  price: number;
}

type BtcOrder = BtcBuyOrder | BtcSellOrder;

type Order = BtcOrder | Erc20Order;

export type {
  AcceptedBtcOrder,
  AcceptedOrdinalOrder,
  BtcBuyOrder,
  BtcOrder,
  BtcSellOrder,
  Erc20Order,
  Order,
  AcceptedBrc20Order,
  Brc20Order,
  OrdinalOrder,
  Utxo
};
