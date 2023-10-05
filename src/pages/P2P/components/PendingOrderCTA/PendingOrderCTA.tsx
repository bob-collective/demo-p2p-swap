import { CTA, Flex, Span } from "@interlay/ui";
import { useCountDown } from "ahooks";

const PendingOrderCTA = ({ deadline, showCta, ctaText, onPress }: { deadline: Date; showCta: boolean; ctaText?: string; onPress?: () => void }) => {
    const [number, formattedRes] = useCountDown({
      targetDate: deadline
    });
  
    if (number <= 0) {
      return showCta ? (
        <CTA onPress={onPress} size='small' variant='secondary'>
          {ctaText}
        </CTA>
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

  export {PendingOrderCTA}