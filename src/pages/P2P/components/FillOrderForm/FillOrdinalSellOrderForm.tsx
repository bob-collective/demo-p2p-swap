import { useForm } from '@interlay/hooks';
import { Card, Flex, Input, P, TokenInput } from '@interlay/ui';
import { useEffect } from 'react';
import { AuthCTA } from '../../../../components/AuthCTA';
import { ContractType, Erc20CurrencyTicker } from '../../../../constants';
import { useBalances } from '../../../../hooks/useBalances';
import { useErc20Allowance } from '../../../../hooks/useErc20Allowance';
import { BtcSellOrder } from '../../../../types/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';
import { fillOrdinalOrderSchema } from '../../../../utils/schemas';
import { isFormDisabled } from '../../../../utils/validation';
import { Amount } from '../../../../utils/amount';
import { useAccount } from '../../../../lib/sats-wagmi';

type FillBTCSellOrderFormData = {
  amount: string;
  btcAddress: string;
};

type FillBtcSellOrderFormProps = {
  isLoading: boolean;
  order: BtcSellOrder;
  onSubmit: (values: FillBTCSellOrderFormData) => void;
};

const FillBtcSellOrderForm = ({ isLoading, order, onSubmit }: FillBtcSellOrderFormProps): JSX.Element => {
  const { balances, getBalance } = useBalances();

  const { address: btcAddress } = useAccount();

  const handleSubmit = (values: FillBTCSellOrderFormData) => {
    wrapInErc20ApprovalTx(() => onSubmit?.(values));
  };

  const inputBalance = getBalance(Erc20CurrencyTicker[order.askingCurrency.ticker]);

  const form = useForm<FillBTCSellOrderFormData>({
    initialValues: {
      amount: toBaseAmount(order.totalAskingAmount, order.askingCurrency.ticker).toString(),
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
  } = useErc20Allowance(ContractType.BTC_MARKETPLACE, order.askingCurrency.ticker);

  const hasEnoughtFunds = inputBalance
    .toBig()
    .lt(new Amount(order.askingCurrency, order.totalAskingAmount.toString()).toBig());
  const isSubmitDisabled = isFormDisabled(form) || !hasEnoughtFunds;

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
          <P size='xs'>
            Remaining available: {toBaseAmount(order.availableLiquidity, order.offeringCurrency.ticker)}{' '}
            {order.offeringCurrency.ticker}
          </P>
        </Card>
        <TokenInput
          label='Pay with'
          isReadOnly
          valueUSD={0}
          ticker={order.askingCurrency.ticker}
          {...form.getTokenFieldProps('amount')}
        />
        <Flex direction='column' gap='spacing2'>
          <P size='s'>You will Receive</P>
          <iframe
            src={`https://testnet.ordinals.com/preview/${'c05c1a49352ce0e91f0ca074a44371721a743b367a9a624d33ac04cf03711f28i0'}`}
            sandbox='allow-scripts'
            scrolling='no'
            loading='lazy'
            allow=''
            height={200}
          />
        </Flex>
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
          {hasEnoughtFunds ? `${!isAskingCurrencyTransferApproved && 'Approve & '} Fill Order` : 'Insufficient Balance'}
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { FillBtcSellOrderForm };
export type { FillBTCSellOrderFormData };
