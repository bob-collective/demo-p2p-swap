import { CTA, Card, Flex, P, Strong, TokenInput } from '@interlay/ui';
import { ChangeEvent, FormEvent, useState } from 'react';
import { formatUSD } from '../../../../utils/format';

type FormData = {
  input?: string;
  output?: string;
};

type FillOrderFormProps = {
  onSubmit: (data: Required<FormData>) => void;
};

const FillOrderForm = ({ onSubmit }: FillOrderFormProps): JSX.Element => {
  const [state, setState] = useState<FormData>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit?.(state as Required<FormData>);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => setState((s) => ({ ...s, input: e.target.value }));

  const handleChangeOutput = (e: ChangeEvent<HTMLInputElement>) => setState((s) => ({ ...s, output: e.target.value }));

  const isComplete = state.input && state.output;

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
          <P size='xs'>Remaining available: 1.36524840 ETH</P>
        </Card>
        <TokenInput
          label='Pay with'
          balance={33}
          onChange={handleChangeInput}
          value={state.input}
          valueUSD={0}
          ticker='USDT'
        />
        <TokenInput
          label='You will Receive'
          balance={33}
          onChange={handleChangeOutput}
          value={state.output}
          valueUSD={0}
          ticker='ETH'
        />
        <Flex direction='column' gap='spacing2'>
          <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
            <P size='xs'>
              Price 1 ETH = <Strong>1,585.176 USDT </Strong>
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
export type { FillOrderFormProps };
