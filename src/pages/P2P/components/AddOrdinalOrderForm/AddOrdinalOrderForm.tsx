import { useForm } from '@interlay/hooks';
import { Card, Flex, Input, P, TokenInput } from '@interlay/ui';
import { mergeProps } from '@react-aria/utils';
import { Key, RefObject, useEffect, useState } from 'react';
import { AuthCTA } from '../../../../components/AuthCTA';
import { CurrencyTicker, Erc20CurrencyTicker } from '../../../../constants';
import { useBalances } from '../../../../hooks/useBalances';
import { formatUSD } from '../../../../utils/format';
import { AddOrdinalOrderSchemaParams, addOrdinalOrderSchema } from '../../../../utils/schemas';
import { isFormDisabled } from '../../../../utils/validation';

type AddOrdinalOrderFormData = {
  amount: string;
  ticker: CurrencyTicker;
  inscriptionId: string;
};

type AddOrdinalOrderFormProps = {
  isLoading: boolean;
  overlappingModalRef: RefObject<HTMLDivElement>;
  onSubmit: (data: Required<AddOrdinalOrderFormData>) => void;
};

const AddOrdinalOrderForm = ({ isLoading, overlappingModalRef, onSubmit }: AddOrdinalOrderFormProps): JSX.Element => {
  const [ticker, setTicker] = useState<CurrencyTicker>(Erc20CurrencyTicker.USDC);

  const { balances, getBalance } = useBalances();

  const handleSubmit = (values: AddOrdinalOrderFormData) => {
    onSubmit(values);
  };

  const schemaParams: AddOrdinalOrderSchemaParams = {
    inputValue: {},
    ownedInscriptions: ['c05c1a49352ce0e91f0ca074a44371721a743b367a9a624d33ac04cf03711f28i0']
  };

  const form = useForm<AddOrdinalOrderFormData>({
    initialValues: {
      ticker,
      amount: '',
      inscriptionId: ''
    },
    validationSchema: addOrdinalOrderSchema(schemaParams),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  useEffect(() => {
    if (!balances) return;

    form.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances]);

  const handleOutputTickerChange = (ticker: CurrencyTicker) => {
    setTicker(ticker);
  };

  const isSubmitDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <Input
          label='Inscription ID'
          placeholder='Enter your inscription ID'
          {...form.getFieldProps('inscriptionId')}
        />

        {!form.errors.inscriptionId && form.values.inscriptionId ? (
          <iframe
            src={`https://testnet.ordinals.com/preview/${form.values.inscriptionId}`}
            sandbox='allow-scripts'
            scrolling='no'
            loading='lazy'
            allow=''
            height={200}
          ></iframe>
        ) : (
          <Card
            style={{ height: 200 }}
            variant='bordered'
            background='secondary'
            alignItems='center'
            justifyContent='center'
          >
            <P size='s'>Waiting for inscription ID...</P>
          </Card>
        )}
        <TokenInput
          type='selectable'
          label='You will Receive'
          valueUSD={0}
          selectProps={mergeProps(
            {
              modalProps: { ref: overlappingModalRef },
              items: [
                { value: 'WBTC', balance: getBalance(Erc20CurrencyTicker.WBTC).toBig().toNumber(), balanceUSD: 0 },
                { value: 'USDC', balance: getBalance(Erc20CurrencyTicker.USDC).toBig().toNumber(), balanceUSD: 0 },
                { value: 'BTC', balance: '—', balanceUSD: 0 }
              ],
              onSelectionChange: (key: Key) => handleOutputTickerChange(key as Erc20CurrencyTicker)
            },
            form.getSelectFieldProps('ticker')
          )}
          {...form.getTokenFieldProps('amount')}
        />
        <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
          <P size='xs'>Tx Fees 0 ETH ({formatUSD(0)})</P>
        </Card>
        <AuthCTA fullWidth loading={isLoading} disabled={isSubmitDisabled} size='large' type='submit'>
          Place Order
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { AddOrdinalOrderForm };
export type { AddOrdinalOrderFormData, AddOrdinalOrderFormProps };
