import { theme } from '@interlay/theme';
import { CTA, Flex } from '@interlay/ui';
import styled from 'styled-components';

const StyledConnectedWallet = styled(Flex)`
  border-bottom: ${theme.border.default};
  padding: ${theme.spacing.spacing1} 0;

  &:first-of-type {
    border-top: ${theme.border.default};
  }
`;

const StyledDisconnectCTA = styled(CTA)`
  background-color: transparent;
  border: 1px solid #ffffff;
`;

const StyledAddressCTA = styled(CTA)`
  padding: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.spacing2};
  cursor: pointer;
`;

export { StyledConnectedWallet, StyledAddressCTA, StyledDisconnectCTA };
