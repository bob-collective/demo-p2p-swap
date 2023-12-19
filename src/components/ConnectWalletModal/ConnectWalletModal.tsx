import { Flex, Modal, ModalBody, ModalHeader, ModalProps, P, Tabs, TabsItem } from '@interlay/ui';
import { useAccount, useDisconnect } from 'wagmi';
import { useAccount as useSatsAccount, useDisconnect as useSatsDisconnect } from '../../lib/sats-wagmi';
import { useConnectWalletModal } from '../../providers/ConnectWalletContext';
import { BtcWalletList } from './BtcWalletList';
import { ConnectWalleSection } from './ConnectWalletSection';
import { EvmWalletList } from './EvmWalletList';

type ConnectWalletModalProps = Omit<ModalProps, 'children'>;

const ConnectWalletModal = ({ onClose, isOpen, ...props }: ConnectWalletModalProps) => {
  const { connector, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { walletTab, setWalletTab } = useConnectWalletModal();

  const { address: btcWalletAddress, connector: btcWalletConnector } = useSatsAccount();
  const { disconnect: btcWalletDisconnect } = useSatsDisconnect();

  const handleDisconnect = () => {
    onClose();
    disconnect();
  };

  const handleBtcWalletDisconnect = () => {
    onClose();
    btcWalletDisconnect();
  };

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
            {connector && address && (
              <ConnectWalleSection
                type='evm'
                address={address}
                onDisconnect={handleDisconnect}
                wallet={connector.name}
              />
            )}
            {btcWalletConnector && btcWalletAddress && (
              <ConnectWalleSection
                type='btc'
                address={btcWalletAddress}
                onDisconnect={handleBtcWalletDisconnect}
                wallet={btcWalletConnector.name}
              />
            )}
          </Flex>
        )}
        <Tabs size='large' selectedKey={walletTab} fullWidth onSelectionChange={(key) => setWalletTab(key as 'evm')}>
          <TabsItem key='evm' title='EVM Wallet'>
            <EvmWalletList onSelectionChange={onClose} />
          </TabsItem>
          <TabsItem key='btc' title='BTC Wallet'>
            <BtcWalletList onSelectionChange={onClose} />
          </TabsItem>
        </Tabs>
      </ModalBody>
    </Modal>
  );
};

export { ConnectWalletModal };
