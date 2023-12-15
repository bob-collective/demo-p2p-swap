export const BtcMarketplaceAbi = [
  {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'address', name: '_relay', internalType: 'contract IRelay' }]
  },
  {
    type: 'event',
    name: 'acceptBtcBuyOrderEvent',
    inputs: [
      { type: 'uint256', name: 'orderId', internalType: 'uint256', indexed: true },
      { type: 'uint256', name: 'acceptId', internalType: 'uint256', indexed: true },
      { type: 'uint256', name: 'amountBtc', internalType: 'uint256', indexed: false },
      { type: 'uint256', name: 'ercAmount', internalType: 'uint256', indexed: false },
      { type: 'address', name: 'ercToken', internalType: 'address', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'acceptBtcSellOrderEvent',
    inputs: [
      { type: 'uint256', name: 'id', internalType: 'uint256', indexed: true },
      { type: 'uint256', name: 'acceptId', internalType: 'uint256', indexed: true },
      {
        type: 'tuple',
        name: 'bitcoinAddress',
        internalType: 'struct BtcMarketPlace.BitcoinAddress',
        indexed: false,
        components: [{ type: 'bytes', name: 'scriptPubKey', internalType: 'bytes' }]
      },
      { type: 'uint256', name: 'amountBtc', internalType: 'uint256', indexed: false },
      { type: 'uint256', name: 'ercAmount', internalType: 'uint256', indexed: false },
      { type: 'address', name: 'ercToken', internalType: 'address', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'cancelAcceptedBtcBuyOrderEvent',
    inputs: [{ type: 'uint256', name: 'id', internalType: 'uint256', indexed: false }],
    anonymous: false
  },
  {
    type: 'event',
    name: 'cancelAcceptedBtcSellOrderEvent',
    inputs: [{ type: 'uint256', name: 'id', internalType: 'uint256', indexed: false }],
    anonymous: false
  },
  {
    type: 'event',
    name: 'placeBtcBuyOrderEvent',
    inputs: [
      { type: 'uint256', name: 'amountBtc', internalType: 'uint256', indexed: false },
      {
        type: 'tuple',
        name: 'bitcoinAddress',
        internalType: 'struct BtcMarketPlace.BitcoinAddress',
        indexed: false,
        components: [{ type: 'bytes', name: 'scriptPubKey', internalType: 'bytes' }]
      },
      { type: 'address', name: 'sellingToken', internalType: 'address', indexed: false },
      { type: 'uint256', name: 'saleAmount', internalType: 'uint256', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'placeBtcSellOrderEvent',
    inputs: [
      { type: 'uint256', name: 'orderId', internalType: 'uint256', indexed: true },
      { type: 'uint256', name: 'amountBtc', internalType: 'uint256', indexed: false },
      { type: 'address', name: 'buyingToken', internalType: 'address', indexed: false },
      { type: 'uint256', name: 'buyAmount', internalType: 'uint256', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'proofBtcBuyOrderEvent',
    inputs: [{ type: 'uint256', name: 'id', internalType: 'uint256', indexed: false }],
    anonymous: false
  },
  {
    type: 'event',
    name: 'proofBtcSellOrderEvent',
    inputs: [{ type: 'uint256', name: 'id', internalType: 'uint256', indexed: false }],
    anonymous: false
  },
  {
    type: 'event',
    name: 'withdrawBtcBuyOrderEvent',
    inputs: [{ type: 'uint256', name: 'id', internalType: 'uint256', indexed: false }],
    anonymous: false
  },
  {
    type: 'event',
    name: 'withdrawBtcSellOrderEvent',
    inputs: [{ type: 'uint256', name: 'id', internalType: 'uint256', indexed: false }],
    anonymous: false
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'REQUEST_EXPIRATION_SECONDS',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'acceptBtcBuyOrder',
    inputs: [
      { type: 'uint256', name: 'id', internalType: 'uint256' },
      { type: 'uint256', name: 'amountBtc', internalType: 'uint256' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'acceptBtcSellOrder',
    inputs: [
      { type: 'uint256', name: 'id', internalType: 'uint256' },
      {
        type: 'tuple',
        name: 'bitcoinAddress',
        internalType: 'struct BtcMarketPlace.BitcoinAddress',
        components: [{ type: 'bytes', name: 'scriptPubKey', internalType: 'bytes' }]
      },
      { type: 'uint256', name: 'amountBtc', internalType: 'uint256' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'uint256', name: 'orderId', internalType: 'uint256' },
      { type: 'uint256', name: 'amountBtc', internalType: 'uint256' },
      { type: 'address', name: 'ercToken', internalType: 'address' },
      { type: 'uint256', name: 'ercAmount', internalType: 'uint256' },
      { type: 'address', name: 'requester', internalType: 'address' },
      { type: 'address', name: 'accepter', internalType: 'address' },
      { type: 'uint256', name: 'acceptTime', internalType: 'uint256' }
    ],
    name: 'acceptedBtcBuyOrders',
    inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'uint256', name: 'orderId', internalType: 'uint256' },
      {
        type: 'tuple',
        name: 'bitcoinAddress',
        internalType: 'struct BtcMarketPlace.BitcoinAddress',
        components: [{ type: 'bytes', name: 'scriptPubKey', internalType: 'bytes' }]
      },
      { type: 'uint256', name: 'amountBtc', internalType: 'uint256' },
      { type: 'address', name: 'ercToken', internalType: 'address' },
      { type: 'uint256', name: 'ercAmount', internalType: 'uint256' },
      { type: 'address', name: 'requester', internalType: 'address' },
      { type: 'address', name: 'accepter', internalType: 'address' },
      { type: 'uint256', name: 'acceptTime', internalType: 'uint256' }
    ],
    name: 'acceptedBtcSellOrders',
    inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'uint256', name: 'amountBtc', internalType: 'uint256' },
      {
        type: 'tuple',
        name: 'bitcoinAddress',
        internalType: 'struct BtcMarketPlace.BitcoinAddress',
        components: [{ type: 'bytes', name: 'scriptPubKey', internalType: 'bytes' }]
      },
      { type: 'address', name: 'offeringToken', internalType: 'address' },
      { type: 'uint256', name: 'offeringAmount', internalType: 'uint256' },
      { type: 'address', name: 'requester', internalType: 'address' }
    ],
    name: 'btcBuyOrders',
    inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'uint256', name: 'amountBtc', internalType: 'uint256' },
      { type: 'address', name: 'askingToken', internalType: 'address' },
      { type: 'uint256', name: 'askingAmount', internalType: 'uint256' },
      { type: 'address', name: 'requester', internalType: 'address' }
    ],
    name: 'btcSellOrders',
    inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'cancelAcceptedBtcBuyOrder',
    inputs: [{ type: 'uint256', name: 'id', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'cancelAcceptedBtcSellOrder',
    inputs: [{ type: 'uint256', name: 'id', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'tuple[]',
        name: '',
        internalType: 'struct BtcMarketPlace.AcceptedBtcBuyOrder[]',
        components: [
          { type: 'uint256', name: 'orderId', internalType: 'uint256' },
          { type: 'uint256', name: 'amountBtc', internalType: 'uint256' },
          { type: 'address', name: 'ercToken', internalType: 'address' },
          { type: 'uint256', name: 'ercAmount', internalType: 'uint256' },
          { type: 'address', name: 'requester', internalType: 'address' },
          { type: 'address', name: 'accepter', internalType: 'address' },
          { type: 'uint256', name: 'acceptTime', internalType: 'uint256' }
        ]
      },
      { type: 'uint256[]', name: '', internalType: 'uint256[]' }
    ],
    name: 'getOpenAcceptedBtcBuyOrders',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'tuple[]',
        name: '',
        internalType: 'struct BtcMarketPlace.AcceptedBtcSellOrder[]',
        components: [
          { type: 'uint256', name: 'orderId', internalType: 'uint256' },
          {
            type: 'tuple',
            name: 'bitcoinAddress',
            internalType: 'struct BtcMarketPlace.BitcoinAddress',
            components: [{ type: 'bytes', name: 'scriptPubKey', internalType: 'bytes' }]
          },
          { type: 'uint256', name: 'amountBtc', internalType: 'uint256' },
          { type: 'address', name: 'ercToken', internalType: 'address' },
          { type: 'uint256', name: 'ercAmount', internalType: 'uint256' },
          { type: 'address', name: 'requester', internalType: 'address' },
          { type: 'address', name: 'accepter', internalType: 'address' },
          { type: 'uint256', name: 'acceptTime', internalType: 'uint256' }
        ]
      },
      { type: 'uint256[]', name: '', internalType: 'uint256[]' }
    ],
    name: 'getOpenAcceptedBtcSellOrders',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'tuple[]',
        name: '',
        internalType: 'struct BtcMarketPlace.BtcBuyOrder[]',
        components: [
          { type: 'uint256', name: 'amountBtc', internalType: 'uint256' },
          {
            type: 'tuple',
            name: 'bitcoinAddress',
            internalType: 'struct BtcMarketPlace.BitcoinAddress',
            components: [{ type: 'bytes', name: 'scriptPubKey', internalType: 'bytes' }]
          },
          { type: 'address', name: 'offeringToken', internalType: 'address' },
          { type: 'uint256', name: 'offeringAmount', internalType: 'uint256' },
          { type: 'address', name: 'requester', internalType: 'address' }
        ]
      },
      { type: 'uint256[]', name: '', internalType: 'uint256[]' }
    ],
    name: 'getOpenBtcBuyOrders',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'tuple[]',
        name: '',
        internalType: 'struct BtcMarketPlace.BtcSellOrder[]',
        components: [
          { type: 'uint256', name: 'amountBtc', internalType: 'uint256' },
          { type: 'address', name: 'askingToken', internalType: 'address' },
          { type: 'uint256', name: 'askingAmount', internalType: 'uint256' },
          { type: 'address', name: 'requester', internalType: 'address' }
        ]
      },
      { type: 'uint256[]', name: '', internalType: 'uint256[]' }
    ],
    name: 'getOpenBtcSellOrders',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'placeBtcBuyOrder',
    inputs: [
      { type: 'uint256', name: 'amountBtc', internalType: 'uint256' },
      {
        type: 'tuple',
        name: 'bitcoinAddress',
        internalType: 'struct BtcMarketPlace.BitcoinAddress',
        components: [{ type: 'bytes', name: 'scriptPubKey', internalType: 'bytes' }]
      },
      { type: 'address', name: 'sellingToken', internalType: 'address' },
      { type: 'uint256', name: 'saleAmount', internalType: 'uint256' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'placeBtcSellOrder',
    inputs: [
      { type: 'uint256', name: 'amountBtc', internalType: 'uint256' },
      { type: 'address', name: 'buyingToken', internalType: 'address' },
      { type: 'uint256', name: 'buyAmount', internalType: 'uint256' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'proofBtcBuyOrder',
    inputs: [
      { type: 'uint256', name: 'id', internalType: 'uint256' },
      {
        type: 'tuple',
        name: 'transaction',
        internalType: 'struct BitcoinTx.Info',
        components: [
          { type: 'bytes4', name: 'version', internalType: 'bytes4' },
          { type: 'bytes', name: 'inputVector', internalType: 'bytes' },
          { type: 'bytes', name: 'outputVector', internalType: 'bytes' },
          { type: 'bytes4', name: 'locktime', internalType: 'bytes4' }
        ]
      },
      {
        type: 'tuple',
        name: 'proof',
        internalType: 'struct BitcoinTx.Proof',
        components: [
          { type: 'bytes', name: 'merkleProof', internalType: 'bytes' },
          { type: 'uint256', name: 'txIndexInBlock', internalType: 'uint256' },
          { type: 'bytes', name: 'bitcoinHeaders', internalType: 'bytes' }
        ]
      }
    ]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'proofBtcSellOrder',
    inputs: [
      { type: 'uint256', name: 'id', internalType: 'uint256' },
      {
        type: 'tuple',
        name: 'transaction',
        internalType: 'struct BitcoinTx.Info',
        components: [
          { type: 'bytes4', name: 'version', internalType: 'bytes4' },
          { type: 'bytes', name: 'inputVector', internalType: 'bytes' },
          { type: 'bytes', name: 'outputVector', internalType: 'bytes' },
          { type: 'bytes4', name: 'locktime', internalType: 'bytes4' }
        ]
      },
      {
        type: 'tuple',
        name: 'proof',
        internalType: 'struct BitcoinTx.Proof',
        components: [
          { type: 'bytes', name: 'merkleProof', internalType: 'bytes' },
          { type: 'uint256', name: 'txIndexInBlock', internalType: 'uint256' },
          { type: 'bytes', name: 'bitcoinHeaders', internalType: 'bytes' }
        ]
      }
    ]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'withdrawBtcBuyOrder',
    inputs: [{ type: 'uint256', name: 'id', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'withdrawBtcSellOrder',
    inputs: [{ type: 'uint256', name: 'id', internalType: 'uint256' }]
  }
] as const;
