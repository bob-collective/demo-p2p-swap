import { ChevronDown } from '@interlay/icons';
import { Flex, List, ListItem, Modal, ModalBody, ModalHeader, ModalProps, P, Tabs, TabsItem } from '@interlay/ui';
import { useCallback } from 'react';
import truncateEthAddress from 'truncate-eth-address';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { CoinbaseWallet, Ledger, Metamask, TrustWallet, WalletConnect, XVerse } from '../../assets/svg';
import { StyledConnectedWallet, StyledDisconnectCTA } from './ConnectWalletModal.style';
import {
  useConnect as useSatsConnect,
  useAccount as useSatsAccount,
  useDisconnect as useSatsDisconnect
} from '../../lib/sats-wagmi';

function shortenBitcoinAddress(address: string) {
  // Extract the first and last 6 characters of the address
  const shortenedAddress = address.slice(0, 6) + '...' + address.slice(-6);
  return shortenedAddress;
}

const Icons: Record<string, typeof Metamask> = {
  Injected: ChevronDown,
  MetaMask: Metamask,
  'Trust Wallet': TrustWallet,
  WalletConnect: WalletConnect,
  WalletConnectLegacy: WalletConnect,
  'Coinbase Wallet': CoinbaseWallet,
  Ledger: Ledger,
  XVerse: XVerse
};
type ConnectWalletModalProps = Omit<ModalProps, 'children'>;

const ConnectWalletModal = ({ onClose, isOpen, ...props }: ConnectWalletModalProps) => {
  const { connectors, connectAsync } = useConnect();
  const { connector, address } = useAccount();
  const { disconnect, disconnectAsync } = useDisconnect();

  const { connectors: satsConnectors, connectAsync: connectBTCWalletAsync } = useSatsConnect();
  const { address: btcWalletAddress, connector: btcWalletConnector } = useSatsAccount();
  const { disconnect: btcWalletDisconnect, disconnectAsync: btcWalletDisconnectAsync } = useSatsDisconnect();

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

  const handleBtcWalletSelect = useCallback(
    async (key: Selection) => {
      // FIXME: simplify this in our UI lib also selectionBehavior throws error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [selectedKey] = [...(key as any)];

      if (selectedKey === btcWalletConnector?.id) return;

      if (btcWalletConnector) {
        await btcWalletDisconnectAsync();
      }

      await connectBTCWalletAsync({
        connector: satsConnectors.find((el) => el.id === selectedKey)
      });

      onClose();
    },
    [connectBTCWalletAsync, btcWalletConnector, btcWalletDisconnectAsync, onClose, satsConnectors]
  );

  const handleDisconnect = () => {
    onClose();
    disconnect();
  };

  const handleBtcWalletDisconnect = () => {
    onClose();
    btcWalletDisconnect();
  };

  const EthereumWallet = connector ? Icons[connector.name] : undefined;
  const BTCWallet = btcWalletConnector ? Icons[btcWalletConnector.name] : undefined;

  const hasEthereumWalletConnect = connector && address;
  const hasBTCWalletConnect = btcWalletConnector && btcWalletAddress;

  return (
    <Modal
      {...props}
      align='top'
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
      <ModalBody gap='spacing6'>
        <P size='s'>
          On Bob, you have the option to link both your EVM and BTC wallets. For optimal functionality, it's advised to
          connect wallets from both networks.
        </P>
        {(hasEthereumWalletConnect || hasBTCWalletConnect) && (
          <Flex direction='column'>
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
            {btcWalletConnector && BTCWallet && btcWalletAddress && (
              <StyledConnectedWallet alignItems='center' justifyContent='space-between' gap='spacing2'>
                <Flex alignItems='center' gap='spacing2'>
                  <BTCWallet size='lg' />
                  <Flex direction='column' gap='spacing2'>
                    <P size='s'>Connected with {btcWalletConnector.name}</P>
                    <P weight='bold' size='s'>
                      {shortenBitcoinAddress(btcWalletAddress)}
                    </P>
                  </Flex>
                </Flex>
                <StyledDisconnectCTA onPress={handleBtcWalletDisconnect} size='small' variant='secondary'>
                  Disconnect
                </StyledDisconnectCTA>
              </StyledConnectedWallet>
            )}
          </Flex>
        )}
        <Tabs size='large' fullWidth>
          <TabsItem title='EVM Wallet'>
            <List
              aria-label='choose available wallets'
              variant='secondary'
              selectedKeys={connector ? [connector.id] : []}
              selectionMode='multiple'
              selectionBehavior='replace'
              onSelectionChange={handleSelect}
              marginTop='spacing4'
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
              selectionMode='multiple'
              selectionBehavior='replace'
              variant='secondary'
              selectedKeys={btcWalletConnector ? [btcWalletConnector.id] : []}
              onSelectionChange={handleBtcWalletSelect}
              marginTop='spacing4'
            >
              {satsConnectors.map((connector) => {
                const Icon = connector.name in Icons ? Icons[connector.name] : Icons.Injected;

                return (
                  <ListItem key={connector.id} textValue={connector.id} alignItems='center' gap='spacing2'>
                    <Icon size='lg' />
                    {connector.name}
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

export { ConnectWalletModal, Icons };
