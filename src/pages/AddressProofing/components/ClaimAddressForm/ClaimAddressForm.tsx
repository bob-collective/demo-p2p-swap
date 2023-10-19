import { useForm } from '@interlay/hooks';
import { Card, Flex, Input, P } from '@interlay/ui';
import { AuthCTA } from '../../../../components/AuthCTA';
import { isFormDisabled } from '../../../../utils/validation';

type ClaimAddressFormData = {
  btcAddress: string;
};

type ClaimAddressFormProps = {
  isLoading: boolean;
  onSubmit: (values: ClaimAddressFormData) => void;
};

const ClaimAddressForm = ({ isLoading, onSubmit }: ClaimAddressFormProps): JSX.Element => {
  const handleSubmit = (values: ClaimAddressFormData) => {
    onSubmit?.(values);
  };

  const form = useForm<ClaimAddressFormData>({
    initialValues: {
      btcAddress: ''
    },
    onSubmit: handleSubmit,
    // TODO: set to hideErrors: "untouced" when allowing partial fullfilments
    hideErrors: {
      btcAddress: 'untouched'
    }
  });

  const isSubmitDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
          <P size='xs'>Claim Your BTC Address</P>
        </Card>
        <Input
          label='Bitcoin Address'
          placeholder='Enter your bitcoin address'
          {...form.getTokenFieldProps('btcAddress')}
        />
        <AuthCTA loading={isLoading} disabled={isSubmitDisabled} size='large' type='submit'>
          Validate Address
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { ClaimAddressForm };
export type { ClaimAddressFormProps, ClaimAddressFormData };
