export const Erc20MarketplaceAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'erc2771Forwarder',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'who',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'buyAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'saleAmount',
        type: 'uint256'
      }
    ],
    name: 'acceptOrder',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'requesterAddress',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'offeringAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'offeringToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'askingAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'askingToken',
        type: 'address'
      }
    ],
    name: 'placeOrder',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256'
      }
    ],
    name: 'withdrawOrder',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'saleAmount',
        type: 'uint256'
      }
    ],
    name: 'acceptErcErcOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'ercErcOrders',
    outputs: [
      {
        internalType: 'uint256',
        name: 'offeringAmount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'offeringToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'askingAmount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'askingToken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'requesterAddress',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getOpenOrders',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'offeringAmount',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'offeringToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'askingAmount',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'askingToken',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'requesterAddress',
            type: 'address'
          }
        ],
        internalType: 'struct MarketPlace.Order[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTrustedForwarder',
    outputs: [
      {
        internalType: 'address',
        name: 'forwarder',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'forwarder',
        type: 'address'
      }
    ],
    name: 'isTrustedForwarder',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'nextOrderId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sellingToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'saleAmount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'buyingToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'buyAmount',
        type: 'uint256'
      }
    ],
    name: 'placeErcErcOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      }
    ],
    name: 'withdrawErcErcOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;
