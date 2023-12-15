import { List, ListItem, ListProps } from '@interlay/ui';
import { useCallback } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { WalletIcon } from '../WalletIcon';

type EvmWalletListProps = Omit<ListProps, 'children'>;

const EvmWalletList = ({ onSelectionChange, ...props }: EvmWalletListProps) => {
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
    [connectAsync, connector, connectors, disconnectAsync, onSelectionChange]
  );

  return (
    <List
      {...props}
      aria-label='choose available wallets'
      variant='secondary'
      selectedKeys={connector ? [connector.id] : []}
      selectionMode='multiple'
      selectionBehavior='replace'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSelectionChange={handleSelect as any}
      marginTop='spacing4'
    >
      {connectors.map((connector) => (
        <ListItem key={connector.id} textValue={connector.id} alignItems='center' gap='spacing2'>
          <WalletIcon name={connector.name} size='lg' />
          {connector.name === 'WalletConnectLegacy' ? 'WalletConnect' : connector.name}
        </ListItem>
      ))}
    </List>
  );
};

export { EvmWalletList };
