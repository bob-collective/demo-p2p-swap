import { ChevronDown } from '@interlay/icons';
import { Flex, List, ListItem, Modal, ModalBody, ModalHeader, ModalProps, P, Tabs, TabsItem } from '@interlay/ui';
import { useCallback } from 'react';
import truncateEthAddress from 'truncate-eth-address';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { CoinbaseWallet, Ledger, Metamask, TrustWallet, WalletConnect } from '../../assets/svg';
import { StyledConnectedWallet, StyledDisconnectCTA } from './ConnectWalletModal.style';

const Icons: Record<string, typeof Metamask> = {
  Injected: ChevronDown,
  MetaMask: Metamask,
  'Trust Wallet': TrustWallet,
  WalletConnect: WalletConnect,
  WalletConnectLegacy: WalletConnect,
  'Coinbase Wallet': CoinbaseWallet,
  Ledger: Ledger
};
type ConnectWalletModalProps = Omit<ModalProps, 'children'>;

const ConnectWalletModal = ({ onClose, isOpen, ...props }: ConnectWalletModalProps) => {
  const { connectors, connectAsync } = useConnect();
  const { connector, address } = useAccount();
  const { disconnect, disconnectAsync } = useDisconnect();

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

      onClose();
    },
    [connectAsync, connector, connectors, disconnectAsync, onClose]
  );

  const handleDisconnect = () => {
    onClose();
    disconnect();
  };

  console.log(isOpen);

  const EthereumWallet = connector ? Icons[connector.name] : undefined;

  return (
    <Modal
      {...props}
      isOpen={isOpen}
      onClose={onClose}
      // MEMO: handles not allowing modal to be closed when connector modals are open
      shouldCloseOnInteractOutside={(el) => {
        const ledgerModal = document.getElementById('ModalWrapper');

        if (ledgerModal) return false;

        if (el.tagName.toLocaleLowerCase() === 'wcm-modal') return false;

        const walletConnect = document.querySelector('[class*="connect-dialog"]');

        if (walletConnect?.contains(el)) return false;

        return true;
      }}
    >
      <ModalHeader align='start'>Connect Wallet</ModalHeader>
      <ModalBody gap='spacing4'>
        <P size='s'>
          On Bob, you have the option to link both your EVM and BTC wallets. For optimal functionality, it's advised to
          connect wallets from both networks.
        </P>
        {connector && EthereumWallet && address && (
          <StyledConnectedWallet alignItems='center' justifyContent='space-between' gap='spacing2'>
            <Flex alignItems='center' gap='spacing2'>
              <EthereumWallet size='lg' />
              <Flex direction='column' gap='spacing2'>
                <P size='s'>Connected with {connector.name}</P>
                <P weight='bold' size='s'>
                  {truncateEthAddress(address)}
                </P>
              </Flex>
            </Flex>
            <StyledDisconnectCTA onPress={handleDisconnect} size='small' variant='secondary'>
              Disconnect
            </StyledDisconnectCTA>
          </StyledConnectedWallet>
        )}
        <Tabs size='large' fullWidth>
          <TabsItem title='EVM Wallet'>
            <List
              aria-label='choose available wallets'
              selectionMode='single'
              variant='secondary'
              selectedKeys={connector ? [connector.id] : []}
              onSelectionChange={handleSelect}
            >
              {connectors.map((connector) => {
                const Icon = connector.name in Icons ? Icons[connector.name] : Icons.Injected;

                return (
                  <ListItem key={connector.id} textValue={connector.id} alignItems='center' gap='spacing2'>
                    <Icon size='lg' />
                    {connector.name === 'WalletConnectLegacy' ? 'WalletConnect' : connector.name}
                  </ListItem>
                );
              })}
            </List>
          </TabsItem>
          <TabsItem title='BTC Wallet'>
            <List
              aria-label='choose available wallets'
              selectionMode='single'
              selectionBehavior='replace'
              variant='secondary'
              selectedKeys={connector ? [connector.id] : []}
              onSelectionChange={handleSelect}
            >
              {connectors.map((connector) => {
                const Icon = connector.name in Icons ? Icons[connector.name] : Icons.Injected;

                return (
                  <ListItem key={connector.id} textValue={connector.id} alignItems='center' gap='spacing2'>
                    <Icon size='lg' />
                    {connector.name === 'WalletConnectLegacy' ? 'WalletConnect' : connector.name}
                  </ListItem>
                );
              })}
            </List>
          </TabsItem>
        </Tabs>
      </ModalBody>
    </Modal>
  );
};

export { ConnectWalletModal };
