import { forwardRef } from 'react';
import { Icon, IconProps } from '@interlay/icons';

const CoinbaseWallet = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <rect width='48' height='48' rx='8' fill='#0052FF' />
    <path
      fillRule='evenodd'
      clip-Rule='evenodd'
      d='M24 6.95233C33.4157 6.95233 41.0477 14.5843 41.0477 24C41.0477 33.4157 33.4157 41.0477 24 41.0477C14.5843 41.0477 6.95233 33.4157 6.95233 24C6.95233 14.5843 14.5843 6.95233 24 6.95233Z'
      fill='white'
    />
    <path
      fillRule='evenodd'
      clip-Rule='evenodd'
      d='M19.8009 18.551H28.1971C28.8883 18.551 29.447 19.1539 29.447 19.895V28.103C29.447 28.8461 28.8864 29.447 28.1971 29.447H19.8009C19.1097 29.447 18.551 28.8441 18.551 28.103V19.895C18.551 19.1539 19.1117 18.551 19.8009 18.551Z'
      fill='#0052FF'
    />
  </Icon>
));

CoinbaseWallet.displayName = 'CoinbaseWallet';

export { CoinbaseWallet };
