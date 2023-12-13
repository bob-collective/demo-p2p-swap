import { forwardRef } from 'react';
import { Icon, IconProps } from '@interlay/icons';

const TrustWallet = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <rect width='48' height='48' rx='8' fill='white' />
    <path d='M10.2222 12.978L24 8.5V39.5C14.1586 35.3663 10.2222 27.4441 10.2222 22.967V12.978Z' fill='#0500FF' />
    <path
      d='M37.7778 12.978L24 8.5V39.5C33.8414 35.3663 37.7778 27.4441 37.7778 22.967V12.978Z'
      fill='url(#paint0_linear_1328_1094)'
    />
    <defs>
      <linearGradient
        id='paint0_linear_1328_1094'
        x1='34.118'
        y1='6.32918'
        x2='23.7105'
        y2='39.0767'
        gradientUnits='userSpaceOnUse'
      >
        <stop offset='0.02' stop-color='#0000FF' />
        <stop offset='0.08' stop-color='#0094FF' />
        <stop offset='0.16' stop-color='#48FF91' />
        <stop offset='0.42' stop-color='#0094FF' />
        <stop offset='0.68' stop-color='#0038FF' />
        <stop offset='0.9' stop-color='#0500FF' />
      </linearGradient>
    </defs>
  </Icon>
));

TrustWallet.displayName = 'TrustWallet';

export { TrustWallet };
