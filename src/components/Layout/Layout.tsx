import { Flex } from '@interlay/ui';
import { HTMLAttributes } from 'react';
import { Header } from './Header';
import { StyledMain } from './Layout.styles';
import { Footer } from './Footer';

const Layout = (props: HTMLAttributes<unknown>) => (
  <Flex direction='column'>
    <Header />
    <StyledMain direction='column' {...props} />
    <Footer />
  </Flex>
);

export { Layout };
