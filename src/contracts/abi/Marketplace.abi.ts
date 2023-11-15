export const Erc20MarketplaceAbi = [
  {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'address', name: 'erc2771Forwarder', internalType: 'address' }]
  },
  {
    type: 'event',
    name: 'acceptOrder',
    inputs: [
      { type: 'uint256', name: 'orderId', internalType: 'uint256', indexed: true },
      { type: 'address', name: 'who', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'buyAmount', internalType: 'uint256', indexed: false },
      { type: 'uint256', name: 'saleAmount', internalType: 'uint256', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'placeOrder',
    inputs: [
      { type: 'uint256', name: 'orderId', internalType: 'uint256', indexed: true },
      { type: 'address', name: 'requesterAddress', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'offeringAmount', internalType: 'uint256', indexed: false },
      { type: 'address', name: 'offeringToken', internalType: 'address', indexed: false },
      { type: 'uint256', name: 'askingAmount', internalType: 'uint256', indexed: false },
      { type: 'address', name: 'askingToken', internalType: 'address', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'withdrawOrder',
    inputs: [{ type: 'uint256', name: 'orderId', internalType: 'uint256', indexed: true }],
    anonymous: false
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'acceptErcErcOrder',
    inputs: [
      { type: 'uint256', name: 'id', internalType: 'uint256' },
      { type: 'uint256', name: 'saleAmount', internalType: 'uint256' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'uint256', name: 'offeringAmount', internalType: 'uint256' },
      { type: 'address', name: 'offeringToken', internalType: 'address' },
      { type: 'uint256', name: 'askingAmount', internalType: 'uint256' },
      { type: 'address', name: 'askingToken', internalType: 'address' },
      { type: 'address', name: 'requesterAddress', internalType: 'address' }
    ],
    name: 'ercErcOrders',
    inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'tuple[]',
        name: '',
        internalType: 'struct MarketPlace.Order[]',
        components: [
          { type: 'uint256', name: 'offeringAmount', internalType: 'uint256' },
          { type: 'address', name: 'offeringToken', internalType: 'address' },
          { type: 'uint256', name: 'askingAmount', internalType: 'uint256' },
          { type: 'address', name: 'askingToken', internalType: 'address' },
          { type: 'address', name: 'requesterAddress', internalType: 'address' }
        ]
      }
    ],
    name: 'getOpenOrders',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: 'forwarder', internalType: 'address' }],
    name: 'getTrustedForwarder',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
    name: 'isTrustedForwarder',
    inputs: [{ type: 'address', name: 'forwarder', internalType: 'address' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'nextOrderId',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'placeErcErcOrder',
    inputs: [
      { type: 'address', name: 'sellingToken', internalType: 'address' },
      { type: 'uint256', name: 'saleAmount', internalType: 'uint256' },
      { type: 'address', name: 'buyingToken', internalType: 'address' },
      { type: 'uint256', name: 'buyAmount', internalType: 'uint256' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'withdrawErcErcOrder',
    inputs: [{ type: 'uint256', name: 'id', internalType: 'uint256' }]
  }
] as const;
