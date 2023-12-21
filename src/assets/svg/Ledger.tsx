import { forwardRef } from 'react';
import { Icon, IconProps } from '@interlay/icons';

const Ledger = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <rect width='48' height='48' rx='8' fill='white' />
    <g clipPath='url(#clip0_1328_1117)'>
      <path
        d='M9.5 29.4013V36.5H20.4081V34.9258H11.0893V29.4013H9.5ZM36.9107 29.4013V34.9258H27.5919V36.4996H38.5V29.4013H36.9107ZM20.424 18.5987V29.401H27.5919V27.9813H22.0133V18.5987H20.424ZM9.5 11.5V18.5987H11.0893V13.0739H20.4081V11.5H9.5ZM27.5919 11.5V13.0739H36.9107V18.5987H38.5V11.5H27.5919Z'
        fill='black'
      />
    </g>
    <defs>
      <clipPath id='clip0_1328_1117'>
        <rect width='29' height='25' fill='white' transform='translate(9.5 11.5)' />
      </clipPath>
    </defs>
  </Icon>
));

Ledger.displayName = 'Ledger';

export { Ledger };
