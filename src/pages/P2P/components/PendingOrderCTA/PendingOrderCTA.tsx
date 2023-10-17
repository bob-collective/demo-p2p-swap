import { Flex, Span } from '@interlay/ui';
import { useCountDown } from 'ahooks';
import { StyledCTA } from '../OrdersTable/OrdersTable.style';

type PendingOrderCTAProps = {
  deadline: Date;
  showCta: boolean;
  ctaText?: string;
  onPress?: () => void;
};

const PendingOrderCTA = ({ deadline, showCta, ctaText, onPress }: PendingOrderCTAProps) => {
  const [number, formattedRes] = useCountDown({
    targetDate: deadline
  });

  if (number <= 0) {
    return showCta ? (
      <StyledCTA onPress={onPress} size='small' variant='secondary'>
        {ctaText}
      </StyledCTA>
    ) : (
      <></>
    );
  }

  const { hours, minutes, seconds } = formattedRes;

  return (
    <Flex gap='spacing2'>
      <Span weight='bold' color='tertiary' size='xs'>
        Pending
      </Span>{' '}
      <Span weight='bold' size='xs' style={{ maxWidth: '3.3rem', width: '3.3rem' }}>
        {hours}:{minutes}:{seconds}
      </Span>
    </Flex>
  );
};

export { PendingOrderCTA };
export type { PendingOrderCTAProps };
