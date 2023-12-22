import { useForm } from '@interlay/hooks';
import { CTA, Card, Flex, Input, Item, P, Select, Span, TokenInput } from '@interlay/ui';
import { mergeProps } from '@react-aria/utils';
import { Key, RefObject, useEffect, useMemo, useState } from 'react';
import { Inscription } from '../../../../components';
import { AuthCTA } from '../../../../components/AuthCTA';
import { CurrencyTicker, Erc20CurrencyTicker } from '../../../../constants';
import { useGetInscriptions } from '../../../../hooks/fetchers/useGetInscriptions';
import { useGetOrders } from '../../../../hooks/fetchers/useGetOrders';
import { useBalances } from '../../../../hooks/useBalances';
import { useAccount } from '../../../../lib/sats-wagmi';
import { formatUSD, ordinalIdToString } from '../../../../utils/format';
import { AddOrdinalOrderSchemaParams, addOrdinalOrderSchema } from '../../../../utils/schemas';
import { truncateInscriptionId } from '../../../../utils/truncate';
import { isFormDisabled } from '../../../../utils/validation';
import { useConnectWalletModal } from '../../../../providers/ConnectWalletContext';

type AddOrdinalOrderFormData = {
  amount: string;
  ticker: CurrencyTicker;
  inscriptionId: string;
};

type AddOrdinalOrderFormProps = {
  isLoading: boolean;
  selectInscriptionModalRef: RefObject<HTMLDivElement>;
  selectTokenModalRef: RefObject<HTMLDivElement>;
  onSubmit: (data: Required<AddOrdinalOrderFormData>) => void;
};

const AddOrdinalOrderForm = ({
  isLoading,
  onSubmit,
  selectTokenModalRef,
  selectInscriptionModalRef
}: AddOrdinalOrderFormProps): JSX.Element => {
  const [ticker, setTicker] = useState<CurrencyTicker>(Erc20CurrencyTicker.USDC);
  const { data: inscriptionsIds } = useGetInscriptions();
  const { address: btcAddress } = useAccount();
  const { setOpen } = useConnectWalletModal();

  const {
    data: { ordinal: ordinalOrders }
  } = useGetOrders();

  const { balances, getBalance } = useBalances();

  const handleSubmit = (values: AddOrdinalOrderFormData) => {
    onSubmit(values);
  };

  const schemaParams: AddOrdinalOrderSchemaParams = {
    inputValue: {}
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

  const availableInscriptionsIds = useMemo(
    () =>
      inscriptionsIds?.filter((id) => !ordinalOrders.owned.find((order) => ordinalIdToString(order.ordinalId) === id)),
    [inscriptionsIds, ordinalOrders.owned]
  );

  const isSubmitDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        {availableInscriptionsIds?.length ? (
          <Select<{ id: string }>
            type='modal'
            modalProps={{ title: 'Inscriptions', ref: selectInscriptionModalRef }}
            size='large'
            label='Inscription ID'
            placeholder='Select an inscription'
            renderValue={(el) => <Span>{truncateInscriptionId(el.value?.id || '')}</Span>}
            items={availableInscriptionsIds.map((id) => ({ id }))}
            {...form.getSelectFieldProps('inscriptionId')}
          >
            {({ id }: { id: string }) => (
              <Item key={id} textValue={id}>
                <Flex direction='column' flex={1} justifyContent='center' alignItems='center' gap='spacing2'>
                  <Inscription style={{ pointerEvents: 'none' }} id={id} height={200}></Inscription>
                  <P size='xs'>{truncateInscriptionId(id)}</P>
                </Flex>
              </Item>
            )}
          </Select>
        ) : (
          <Input
            label='Inscription ID'
            placeholder='Enter your inscription ID'
            {...form.getFieldProps('inscriptionId')}
          />
        )}
        {!form.errors.inscriptionId && form.values.inscriptionId ? (
          <Inscription id={form.values.inscriptionId} height={200}></Inscription>
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
        {!btcAddress && (
          <Flex gap='spacing2'>
            <P size='xs'>TIP: Connect your BTC wallet for a better experience</P>
            <CTA onPress={() => setOpen(true, { walletTab: 'btc' })} size='x-small'>
              Connect
            </CTA>
          </Flex>
        )}
        <TokenInput
          type='selectable'
          label='You will Receive'
          valueUSD={0}
          selectProps={mergeProps(
            {
              modalProps: { ref: selectTokenModalRef },
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
