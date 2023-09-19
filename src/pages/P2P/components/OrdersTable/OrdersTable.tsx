import { CTA, Card, Flex, Modal, ModalBody, ModalHeader, Span, Table, TableProps, TokenStack } from '@interlay/ui';
import { ReactNode, useState } from 'react';
import { formatUSD } from '../../../../utils/format';
import { FillOrderForm } from '../FillOrderForm';
import { CancelOrderModal } from '../CancelOrderModal';

const AmountCell = ({ amount, valueUSD, ticker }: { amount: string; ticker: string; valueUSD?: number }) => (
  <Flex alignItems='flex-start' direction='column'>
    <Span size='s' weight='bold'>
      {amount} {ticker}
    </Span>
    {valueUSD && <Span size='s'>{formatUSD(valueUSD)}</Span>}
  </Flex>
);

const AssetCell = ({ name, tickers }: { name: string; tickers: string[] }) => (
  <Flex alignItems='center' gap='spacing2'>
    <TokenStack tickers={tickers} />
    <Span weight='bold' size='s'>
      {name}
    </Span>
  </Flex>
);

enum OrdersTableColumns {
  ASSET = 'asset',
  PRICE_PER_UNIT = 'pricePerUnit',
  AVAILABLE_TO_BUY = 'availableToBuy',
  ACTION = 'action'
}

type OrdersTableRow = {
  id: string;
  [OrdersTableColumns.ASSET]: ReactNode;
  [OrdersTableColumns.PRICE_PER_UNIT]: ReactNode;
  [OrdersTableColumns.AVAILABLE_TO_BUY]: ReactNode;
  [OrdersTableColumns.ACTION]: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type OrdersTableProps = Props & InheritAttrs;

const OrdersTable = (props: OrdersTableProps): JSX.Element => {
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [isCancelOrderModalOpen, setCancelOrderModal] = useState(false);

  const handleCloseOrderModal = () => setOrderModalOpen(false);

  const columns = [
    { name: 'Asset', uid: OrdersTableColumns.ASSET },
    { name: 'Price per unit', uid: OrdersTableColumns.PRICE_PER_UNIT },
    { name: 'Available to buy', uid: OrdersTableColumns.AVAILABLE_TO_BUY },
    { name: '', uid: OrdersTableColumns.ACTION }
  ];

  const rows: OrdersTableRow[] = [
    {
      id: '1',
      asset: <AssetCell name='ETH' tickers={['ETH', 'USDT']} />,
      pricePerUnit: <AmountCell amount={'1,570.917'} ticker='USDT' />,
      availableToBuy: <AmountCell amount='1.36524840' ticker='ETH' valueUSD={20000} />,
      action: (
        <CTA onPress={() => setOrderModalOpen(true)} size='small'>
          Fill Order
        </CTA>
      )
    },
    {
      id: '2',
      asset: <AssetCell name='BTC' tickers={['BTC', 'USDT']} />,
      pricePerUnit: <AmountCell amount={'1,570.917'} ticker='USDT' />,
      availableToBuy: <AmountCell amount='1.36524840' ticker='BTC' valueUSD={20000} />,
      action: (
        <CTA variant='secondary' onPress={() => setCancelOrderModal(true)} size='small'>
          Cancel Order
        </CTA>
      )
    }
  ];

  return (
    <>
      <Card>
        <Table {...props} columns={columns} rows={rows} />
      </Card>
      <Modal isOpen={isOrderModalOpen} onClose={handleCloseOrderModal}>
        <ModalHeader>Fill Order</ModalHeader>
        <ModalBody>
          <FillOrderForm onSubmit={handleCloseOrderModal} />
        </ModalBody>
      </Modal>
      <CancelOrderModal isOpen={isCancelOrderModalOpen} onClose={() => setCancelOrderModal(false)} />
    </>
  );
};

export { OrdersTable };
export type { OrdersTableProps };
