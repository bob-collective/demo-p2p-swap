import { theme } from '@interlay/theme';
import { CTA, Flex } from '@interlay/ui';
import styled from 'styled-components';

const StyledHeader = styled(Flex)`
  padding: ${theme.spacing.spacing2} ${theme.spacing.spacing4};

  @media ${theme.breakpoints.up('md')} {
    padding: ${theme.spacing.spacing2} ${theme.spacing.spacing12};
  }
`;

const StyledConnectedCTA = styled(CTA)`
  display: flex;
  gap: ${theme.spacing.spacing2};
  padding: ${theme.spacing.spacing2} ${theme.spacing.spacing3};
  border-radius: ${theme.rounded.full};
  background-color: rgba(0, 0, 0, 1);
  border: none;
  color: rgba(255, 255, 255, 1);
  font-size: ${theme.text.s};
  padding: ${theme.spacing.spacing2} ${theme.spacing.spacing4};

  &:hover:not([disabled]) {
    background-color: rgba(0, 0, 0, 1);
  }
`;

const StyledMain = styled(Flex)`
  margin: ${theme.spacing.spacing6} auto;
  width: 100%;
  padding: 0 ${theme.spacing.spacing4};
  max-width: ${theme.breakpoints.values.lg}px;

  @media ${theme.breakpoints.up('md')} {
    padding: 0 ${theme.spacing.spacing12};
  }
`;

const StyledFooter = styled(Flex)`
  padding: 0 ${theme.spacing.spacing4};

  @media ${theme.breakpoints.up('md')} {
    padding: 0 ${theme.spacing.spacing12};
  }

  min-height: 55px;
`;

const CTAWrapper = styled(Flex)`
  gap: ${theme.spacing.spacing2};
`;

const StyledWallets = styled(Flex)`
  > :not(:last-child) {
    // Coin one covers 30% of coin two
    margin-right: -6px;
  }
`;

export { StyledFooter, StyledHeader, StyledMain, StyledConnectedCTA, CTAWrapper, StyledWallets };
