import { HTMLAttributes } from 'react';
import { theme } from '@interlay/theme';

const Layout = (props: HTMLAttributes<unknown>) => (
  <main
    style={{
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
      padding: theme.spacing.spacing4,
      maxWidth: theme.breakpoints.values.md,
      display: 'flex',
      flexDirection: 'column'
    }}
    {...props}
  />
);

export { Layout };
