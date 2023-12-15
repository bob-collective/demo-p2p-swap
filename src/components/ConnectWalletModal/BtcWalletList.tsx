import { List, ListItem, ListProps } from '@interlay/ui';
import { useCallback } from 'react';
import { useAccount, useConnect, useDisconnect } from '../../lib/sats-wagmi';
import { WalletIcon } from '../WalletIcon';

type BtcWalletListProps = Omit<ListProps, 'children'>;

const BtcWalletList = ({ onSelectionChange, ...props }: BtcWalletListProps) => {
  const { connectors, connectAsync } = useConnect();
  const { connector } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const handleSelect = useCallback(
    async (key: Selection) => {
      // FIXME: simplify this in our UI lib also selectionBehavior throws error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [selectedKey] = [...(key as any)];

      if (selectedKey === connector?.id) return;

      if (connector) {
        await disconnectAsync();
      }

      await connectAsync({
        connector: connectors.find((el) => el.id === selectedKey)
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSelectionChange?.(key as any);
    },
    [connector, connectAsync, connectors, onSelectionChange, disconnectAsync]
  );

  return (
    <List
      {...props}
      aria-label='choose available wallets'
      selectionMode='multiple'
      selectionBehavior='replace'
      variant='secondary'
      selectedKeys={connector ? [connector.id] : []}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSelectionChange={handleSelect as any}
      marginTop='spacing4'
    >
      {connectors.map((connector) => (
        <ListItem key={connector.id} textValue={connector.id} alignItems='center' gap='spacing2'>
          <WalletIcon name={connector.name} size='lg' />
          {connector.name}
        </ListItem>
      ))}
    </List>
  );
};

export { BtcWalletList };
