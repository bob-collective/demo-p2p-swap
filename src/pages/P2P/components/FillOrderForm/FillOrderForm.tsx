import { Order } from '../../../../types/orders';
import { isBtcBuyOrder, isErc20Order } from '../../../../utils/orders';
import { FillErc20OrderForm, FillErc20OrderFormData } from './FillErc20OrderForm';
import { FillBtcBuyOrderForm, FillBTCBuyOrderFormData } from './FillBtcBuyOrderForm';
import { FillBtcSellOrderForm, FillBTCSellOrderFormData } from './FillBtcSellOrderForm';

type FillOrderFormData =
  | { type: 'erc20'; values: FillErc20OrderFormData }
  | { type: 'sell-btc'; values: FillBTCSellOrderFormData }
  | { type: 'buy-btc'; values: FillBTCBuyOrderFormData };

type FillOrderFormProps = {
  isLoading: boolean;
  order: Order;
  onSubmit: (data: FillOrderFormData) => void;
};

const FillOrderForm = ({ isLoading, order, onSubmit }: FillOrderFormProps): JSX.Element => {
  if (isErc20Order(order)) {
    return (
      <FillErc20OrderForm
        isLoading={isLoading}
        order={order}
        onSubmit={(values) => onSubmit({ type: 'erc20', values })}
      />
    );
  }
  if (isBtcBuyOrder(order))
    return (
      <FillBtcBuyOrderForm
        isLoading={isLoading}
        order={order}
        onSubmit={(values) => onSubmit({ type: 'buy-btc', values })}
      />
    );
  else
    return (
      <FillBtcSellOrderForm
        isLoading={isLoading}
        order={order}
        onSubmit={(values) => onSubmit({ type: 'sell-btc', values })}
      />
    );
};

export { FillOrderForm };
export type { FillOrderFormProps, FillOrderFormData };
