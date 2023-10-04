import { Flex, Card, P, TokenInput, Strong, CTA } from '@interlay/ui';
import { FormEvent } from 'react';
import { Erc20CurrencyTicker } from '../../../../constants';
import { useBalances } from '../../../../hooks/useBalances';
import { BtcBuyOrder } from '../../../../types/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';

type FillBtcBuyOrderFormProps = {
  order: BtcBuyOrder;
  onSubmit: () => void;
};

const FillBtcBuyOrderForm = ({ order, onSubmit }: FillBtcBuyOrderFormProps): JSX.Element => {
  const { getBalanceInBaseDecimals } = useBalances();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit?.();
  };

  const outputAmount = toBaseAmount(order.availableLiquidity, order.offeringCurrency.ticker);

  const inputAmount = order.price * parseFloat(outputAmount);

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
          <P size='xs'>
            Remaining available: {toBaseAmount(order.availableLiquidity, order.offeringCurrency.ticker)}{' '}
            {order.offeringCurrency.ticker}
          </P>
        </Card>
        <TokenInput
          label='Pay with'
          balance={undefined}
          value={inputAmount}
          isDisabled // TODO: remove after we start allowing partial fullfilments
          valueUSD={0}
          ticker={order.askingCurrency.ticker}
        />
        <TokenInput
          label='You will Receive'
          balance={getBalanceInBaseDecimals(Erc20CurrencyTicker[order.offeringCurrency.ticker])}
          value={outputAmount}
          isDisabled
          valueUSD={0}
          ticker={order.offeringCurrency.ticker}
        />
        <Flex direction='column' gap='spacing2'>
          <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
            <P size='xs'>
              Price 1 {order.offeringCurrency.ticker} ={' '}
              <Strong>
                {order.price} {order.askingCurrency.ticker}{' '}
              </Strong>
            </P>
          </Card>
          <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
            <P size='xs'>Tx Fees 0 BOB ({formatUSD(0)})</P>
          </Card>
        </Flex>
      </Flex>
      <CTA size='large' type='submit'>
        Fill Order
      </CTA>
    </form>
  );
};

export { FillBtcBuyOrderForm };
