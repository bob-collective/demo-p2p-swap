import { CTA, Card, Flex, P, Strong, TokenInput } from '@interlay/ui';
import { ChangeEvent, FormEvent, useState } from 'react';
import { ContractType, Erc20CurrencyTicker } from '../../../../constants';
import { useBalances } from '../../../../hooks/useBalances';
import { useErc20Allowance } from '../../../../hooks/useErc20Allowance';
import { Erc20Order } from '../../../../types/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';

type FillOrderFormData = {
  input?: string;
};

type FillErc20OrderFormProps = {
  order: Erc20Order;
  onSubmit: (data: Required<FillOrderFormData>) => void;
};

const FillErc20OrderForm = ({ order, onSubmit }: FillErc20OrderFormProps): JSX.Element => {
  const [state, setState] = useState<FillOrderFormData>({});

  const { getBalanceInBaseDecimals } = useBalances();

  const { isAllowed: isAskingCurrencyTransferApproved, wrapInErc20ApprovalTx } = useErc20Allowance(
    ContractType.ERC20_MARKETPLACE,
    order.askingCurrency.ticker
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    wrapInErc20ApprovalTx(() => onSubmit?.(state as Required<FillOrderFormData>));
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => setState((s) => ({ ...s, input: e.target.value }));

  const handleChangeOutput = (e: ChangeEvent<HTMLInputElement>) => setState((s) => ({ ...s, output: e.target.value }));

  const isComplete = state.input;

  const outputAmount = state.input ? parseFloat(state.input) / order.price : 0;

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
      <CTA disabled={!isComplete} size='large' type='submit'>
        {isAskingCurrencyTransferApproved ? 'Fill Order' : 'Approve & Fill Order'}
      </CTA>
    </form>
  );
};

export { FillErc20OrderForm };
export type { FillErc20OrderFormProps, FillOrderFormData };
