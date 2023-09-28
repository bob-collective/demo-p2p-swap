import { CTA, Card, Flex, P, Strong, TokenInput } from '@interlay/ui';
import { ChangeEvent, FormEvent, useState } from 'react';
import { formatUSD } from '../../../../utils/format';
import { Erc20Order } from '../../../../hooks/fetchers/useGetActiveOrders';
import { useBalances } from '../../../../hooks/useBalances';
import { Erc20CurrencyTicker } from '../../../../constants';
import { toBaseAmountErc20 } from '../../../../utils/currencies';

type FillOrderFormData = {
  input?: string;
};

type FillOrderFormProps = {
  order: Erc20Order | undefined;
  onSubmit: (data: Required<FillOrderFormData>) => void;
};

const FillOrderForm = ({ order, onSubmit }: FillOrderFormProps): JSX.Element => {
  const [state, setState] = useState<FillOrderFormData>({});
  const { getBalanceInBaseDecimals } = useBalances();

  if (!order) {
    // TODO: handle better
    return <></>;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit?.(state as Required<FillOrderFormData>);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => setState((s) => ({ ...s, input: e.target.value }));

  const handleChangeOutput = (e: ChangeEvent<HTMLInputElement>) => setState((s) => ({ ...s, output: e.target.value }));

  const isComplete = state.input;

  const outputAmount = state.input ? parseFloat(state.input) / order.price : 0

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
          <P size='xs'>Remaining available: {toBaseAmountErc20(order.availableLiquidity, order.offeringCurrency.ticker)} {order.offeringCurrency.ticker}</P>
        </Card>
        <TokenInput
          label='Pay with'
          balance={getBalanceInBaseDecimals(Erc20CurrencyTicker[order.askingCurrency.ticker])}
          onChange={handleChangeInput}
          value={state.input}
          valueUSD={0}
          ticker={order.askingCurrency.ticker}
        />
        <TokenInput
          label='You will Receive'
          balance={getBalanceInBaseDecimals(Erc20CurrencyTicker[order.offeringCurrency.ticker])}
          onChange={handleChangeOutput}
          value={outputAmount}
          isDisabled
          valueUSD={0}
          ticker={order.offeringCurrency.ticker}
        />
        <Flex direction='column' gap='spacing2'>
          <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
            <P size='xs'>
              Price 1 {order.offeringCurrency.ticker} = <Strong>{order.price} {order.askingCurrency.ticker} </Strong>
            </P>
          </Card>
          <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
            <P size='xs'>Tx Fees 0 BOB ({formatUSD(0)})</P>
          </Card>
        </Flex>
      </Flex>
      <CTA disabled={!isComplete} size='large' type='submit'>
        Fill Order
      </CTA>
    </form>
  );
};

export { FillOrderForm };
export type { FillOrderFormProps, FillOrderFormData };
