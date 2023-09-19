import { CTA, Card, Flex, P, Strong, TokenInput } from '@interlay/ui';
import { ChangeEvent, FormEvent, RefObject, useState } from 'react';
import { formatUSD } from '../../../../utils/format';

type FormData = {
  inputValue?: string;
  outputValue?: string;
  inputTicker?: string;
  outputTicker?: string;
};

type AddOrderFormProps = {
  offerModalRef: RefObject<HTMLDivElement>;
  receiveModalRef: RefObject<HTMLDivElement>;
  onSubmit: (data: Required<FormData>) => void;
};

const AddOrderForm = ({ offerModalRef, receiveModalRef, onSubmit }: AddOrderFormProps): JSX.Element => {
  const [state, setState] = useState<FormData>({
    inputTicker: 'ETH',
    outputTicker: 'USDT'
  });

  const isComplete = state.inputTicker && state.outputTicker && state.inputValue && state.outputValue;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit?.(state as Required<FormData>);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) =>
    setState((s) => ({ ...s, inputValue: e.target.value }));

  const handleChangeOutput = (e: ChangeEvent<HTMLInputElement>) =>
    setState((s) => ({ ...s, outputValue: e.target.value }));

  const handleInputTickerChange = (ticker: string) => {
    const isDuplicate = ticker === state.outputTicker;

    return setState((s) => ({
      ...s,
      outputTicker: isDuplicate ? s.inputTicker : s.outputTicker,
      inputTicker: ticker
    }));
  };

  const handleOutputTickerChange = (ticker: string) => {
    const isDuplicate = ticker === state.inputTicker;

    return setState((s) => ({
      ...s,
      inputTicker: isDuplicate ? s.outputTicker : s.inputTicker,
      outputTicker: ticker
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <P size='s'>Input the details and values of your order's assets</P>
        <TokenInput
          label='Offer'
          balance={33}
          onChange={handleChangeInput}
          value={state.inputValue}
          valueUSD={0}
          selectProps={{
            modalRef: offerModalRef,
            value: state.inputTicker,
            items: [
              { value: 'BTC', balance: 0, balanceUSD: formatUSD(0) },
              { value: 'ETH', balance: 0, balanceUSD: formatUSD(0) },
              { value: 'USDT', balance: 0, balanceUSD: formatUSD(0) }
            ],
            onSelectionChange: (key) => handleInputTickerChange(key as string)
          }}
        />
        <TokenInput
          label='You will Receive'
          balance={33}
          onChange={handleChangeOutput}
          value={state.outputValue}
          valueUSD={0}
          selectProps={{
            modalRef: receiveModalRef,
            value: state.outputTicker,
            items: [
              { value: 'BTC', balance: 0, balanceUSD: formatUSD(0) },
              { value: 'ETH', balance: 0, balanceUSD: formatUSD(0) },
              { value: 'USDT', balance: 0, balanceUSD: formatUSD(0) }
            ],
            onSelectionChange: (key) => handleOutputTickerChange(key as string)
          }}
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
        Place Order
      </CTA>
    </form>
  );
};

export { AddOrderForm };
export type { AddOrderFormProps };
