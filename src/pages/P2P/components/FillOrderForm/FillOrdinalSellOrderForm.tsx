import { useForm } from '@interlay/hooks';
import { Card, Flex, Input, P, TokenInput } from '@interlay/ui';
import { useEffect } from 'react';
import { AuthCTA } from '../../../../components/AuthCTA';
import { ContractType, Erc20CurrencyTicker } from '../../../../constants';
import { useBalances } from '../../../../hooks/useBalances';
import { useErc20Allowance } from '../../../../hooks/useErc20Allowance';
import { useAccount } from '../../../../lib/sats-wagmi';
import { Brc20Order, OrdinalOrder } from '../../../../types/orders';
import { Amount } from '../../../../utils/amount';
import { toBaseAmount } from '../../../../utils/currencies';
import { formatUSD, ordinalIdToString } from '../../../../utils/format';
import { fillOrdinalOrderSchema } from '../../../../utils/schemas';
import { isFormDisabled } from '../../../../utils/validation';
import { Inscription } from '../../../../components';
import { truncateInscriptionId } from '../../../../utils/truncate';
import { mergeProps } from '@react-aria/utils';

type FillOrdinalSellOrderFormData = {
  inputAmount: string;
  outputAmount?: string;
  btcAddress: string;
};

type FillOrdinalSellOrderFormProps = {
  isLoading: boolean;
  order: OrdinalOrder | Brc20Order;
  onSubmit: (values: FillOrdinalSellOrderFormData) => void;
};

const FillOrdinalSellOrderForm = ({ isLoading, order, onSubmit }: FillOrdinalSellOrderFormProps): JSX.Element => {
  const { balances, getBalance } = useBalances();

  const { address: btcAddress } = useAccount();

  const handleSubmit = (values: FillOrdinalSellOrderFormData) => {
    wrapInErc20ApprovalTx(() => onSubmit?.(values));
  };

  const inputBalance = getBalance(Erc20CurrencyTicker[order.askingCurrency.ticker]);

  const { amount } = order as Brc20Order;

  const form = useForm<FillOrdinalSellOrderFormData>({
    initialValues: {
      inputAmount: toBaseAmount(order.totalAskingAmount, order.askingCurrency.ticker).toString(),
      outputAmount: amount ? amount?.toBig().toString() : undefined,
      btcAddress: btcAddress || ''
    },
    validationSchema: fillOrdinalOrderSchema(),
    onSubmit: handleSubmit,
    // TODO: set to hideErrors: "untouced" when allowing partial fullfilments
    hideErrors: {
      btcAddress: 'untouched'
    }
  });

  useEffect(() => {
    if (!balances) return;

    form.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances]);

  const {
    isLoading: isLoadingAllowance,
    isAllowed: isAskingCurrencyTransferApproved,
    wrapInErc20ApprovalTx
  } = useErc20Allowance(ContractType.ORD_MARKETPLACE, order.askingCurrency.ticker);

  const hasEnoughFunds = inputBalance
    .toBig()
    .gte(new Amount(order.askingCurrency, order.totalAskingAmount.toString()).toBig());

  const isSubmitDisabled = (!btcAddress && isFormDisabled(form)) || !hasEnoughFunds;

  const inscriptionId = ordinalIdToString(order.ordinalId);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <TokenInput
          label='Pay with'
          balance={inputBalance.toBig().toString()}
          balanceLabel='Available'
          isReadOnly
          valueUSD={0}
          ticker={order.askingCurrency.ticker}
          {...form.getTokenFieldProps('inputAmount')}
        />
        {amount ? (
          <TokenInput
            label='You will Receive'
            isReadOnly
            valueUSD={0}
            ticker={amount.currency.ticker}
            {...mergeProps(form.getTokenFieldProps('outputAmount'))}
          />
        ) : (
          <Flex direction='column' gap='spacing2'>
            <P size='xs'>You will Receive</P>
            <Inscription id={inscriptionId} height={200} />
            <P align='center' size='xs'>
              {truncateInscriptionId(inscriptionId)}
            </P>
          </Flex>
        )}
        <Input
          label='Bitcoin Address'
          placeholder='Enter your bitcoin address'
          isReadOnly={!!btcAddress}
          {...form.getTokenFieldProps('btcAddress')}
        />
        <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
          <P size='xs'>Tx Fees 0 ETH ({formatUSD(0)})</P>
        </Card>
        <AuthCTA loading={isLoading || isLoadingAllowance} disabled={isSubmitDisabled} size='large' type='submit'>
          {hasEnoughFunds
            ? `${!isAskingCurrencyTransferApproved ? 'Approve & ' : ''} Fill Order`
            : 'Insufficient Balance'}
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { FillOrdinalSellOrderForm };
export type { FillOrdinalSellOrderFormData };
