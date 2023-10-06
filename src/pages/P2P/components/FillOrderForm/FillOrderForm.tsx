import { Order } from '../../../../types/orders';
import { isBtcBuyOrder, isErc20Order, isBtcSellOrder } from '../../../../utils/orders';
import { FillErc20OrderForm } from './FillErc20OrderForm';
import { FillBtcBuyOrderForm } from './FillBtcBuyOrderForm';
import { FillBtcSellOrderForm } from './FillBtcSellOrderForm';

type FillOrderFormData = {
  input?: string;
};

type FillOrderFormProps = {
  order: Order;
  onSubmit: (data?: Required<FillOrderFormData>) => void;
};

const FillOrderForm = ({ order, onSubmit }: FillOrderFormProps): JSX.Element => {
  if (isErc20Order(order)) {
    return <FillErc20OrderForm {...{ order, onSubmit }} />;
  }
  if (isBtcBuyOrder(order)) return <FillBtcBuyOrderForm {...{ order, onSubmit }} />;
  if (isBtcSellOrder(order)) return <FillBtcSellOrderForm {...{ order, onSubmit }} />;
  return <></>;
  // TODO: handle btc sell order
};

export { FillOrderForm };
export type { FillOrderFormProps, FillOrderFormData };
