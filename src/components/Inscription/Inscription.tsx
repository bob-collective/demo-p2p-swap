import { IframeHTMLAttributes } from 'react';

type Props = {
  id: string;
};

type InheritAttrs = Omit<IframeHTMLAttributes<unknown>, keyof Props>;

type InscriptionProps = Props & InheritAttrs;

const Inscription = ({ id, ...props }: InscriptionProps) => (
  <iframe
    {...props}
    src={`https://testnet.ordinals.com/preview/${id}`}
    sandbox='allow-scripts'
    scrolling='no'
    loading='lazy'
    allow=''
  ></iframe>
);

export { Inscription };
export type { InscriptionProps };
