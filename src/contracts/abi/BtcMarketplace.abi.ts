export const BtcMarketplaceAbi = [
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
        internalType: 'uint256',
        name: 'acceptId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountBtc',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'ercAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'ercToken',
        type: 'address'
      }
    ],
    name: 'acceptBtcBuyOrderEvent',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'acceptId',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'bitcoinAddress',
            type: 'string'
          }
        ],
        indexed: false,
        internalType: 'struct BtcMarketPlace.BitcoinAddress',
        name: 'bitcoinAddress',
        type: 'tuple'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountBtc',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'ercAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'ercToken',
        type: 'address'
      }
    ],
    name: 'acceptBtcSellOrderEvent',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      }
    ],
    name: 'cancelAcceptedBtcBuyOrderEvent',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      }
    ],
    name: 'cancelAcceptedBtcSellOrderEvent',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountBtc',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'bitcoinAddress',
            type: 'string'
          }
        ],
        indexed: false,
        internalType: 'struct BtcMarketPlace.BitcoinAddress',
        name: 'bitcoinAddress',
        type: 'tuple'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'sellingToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'saleAmount',
        type: 'uint256'
      }
    ],
    name: 'placeBtcBuyOrderEvent',
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
        indexed: false,
        internalType: 'uint256',
        name: 'amountBtc',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyingToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'buyAmount',
        type: 'uint256'
      }
    ],
    name: 'placeBtcSellOrderEvent',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'dummy',
            type: 'uint256'
          }
        ],
        indexed: false,
        internalType: 'struct BtcMarketPlace.TransactionProof',
        name: '_proof',
        type: 'tuple'
      }
    ],
    name: 'proofBtcBuyOrderEvent',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'dummy',
            type: 'uint256'
          }
        ],
        indexed: false,
        internalType: 'struct BtcMarketPlace.TransactionProof',
        name: '_proof',
        type: 'tuple'
      }
    ],
    name: 'proofBtcSellOrderEvent',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      }
    ],
    name: 'withdrawBtcBuyOrderEvent',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      }
    ],
    name: 'withdrawBtcSellOrderEvent',
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
        name: 'amountBtc',
        type: 'uint256'
      }
    ],
    name: 'acceptBtcBuyOrder',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'bitcoinAddress',
            type: 'string'
          }
        ],
        internalType: 'struct BtcMarketPlace.BitcoinAddress',
        name: 'bitcoinAddress',
        type: 'tuple'
      },
      {
        internalType: 'uint256',
        name: 'amountBtc',
        type: 'uint256'
      }
    ],
    name: 'acceptBtcSellOrder',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
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
    name: 'cancelAcceptedBtcBuyOrder',
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
    name: 'cancelAcceptedBtcSellOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountBtc',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'bitcoinAddress',
            type: 'string'
          }
        ],
        internalType: 'struct BtcMarketPlace.BitcoinAddress',
        name: 'bitcoinAddress',
        type: 'tuple'
      },
      {
        internalType: 'address',
        name: 'sellingToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'saleAmount',
        type: 'uint256'
      }
    ],
    name: 'placeBtcBuyOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountBtc',
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
    name: 'placeBtcSellOrder',
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
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'dummy',
            type: 'uint256'
          }
        ],
        internalType: 'struct BtcMarketPlace.TransactionProof',
        name: '_proof',
        type: 'tuple'
      }
    ],
    name: 'proofBtcBuyOrder',
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
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'dummy',
            type: 'uint256'
          }
        ],
        internalType: 'struct BtcMarketPlace.TransactionProof',
        name: '_proof',
        type: 'tuple'
      }
    ],
    name: 'proofBtcSellOrder',
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
    name: 'withdrawBtcBuyOrder',
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
    name: 'withdrawBtcSellOrder',
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
    name: 'acceptedBtcBuyOrders',
    outputs: [
      {
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'amountBtc',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'ercToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'ercAmount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'requester',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'accepter',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'acceptTime',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
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
    name: 'acceptedBtcSellOrders',
    outputs: [
      {
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'bitcoinAddress',
            type: 'string'
          }
        ],
        internalType: 'struct BtcMarketPlace.BitcoinAddress',
        name: 'bitcoinAddress',
        type: 'tuple'
      },
      {
        internalType: 'uint256',
        name: 'amountBtc',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'ercToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'ercAmount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'requester',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'accepter',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'acceptTime',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
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
    name: 'btcBuyOrders',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountBtc',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'bitcoinAddress',
            type: 'string'
          }
        ],
        internalType: 'struct BtcMarketPlace.BitcoinAddress',
        name: 'bitcoinAddress',
        type: 'tuple'
      },
      {
        internalType: 'address',
        name: 'offeringToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'offeringAmount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'requester',
        type: 'address'
      }
    ],
    stateMutability: 'view',
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
    name: 'btcSellOrders',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountBtc',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'askingToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'askingAmount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'requester',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getOpenAcceptedBtcBuyOrders',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'amountBtc',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'ercToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'ercAmount',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'requester',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'accepter',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'acceptTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct BtcMarketPlace.AcceptedBtcBuyOrder[]',
        name: '',
        type: 'tuple[]'
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getOpenAcceptedBtcSellOrders',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'bitcoinAddress',
                type: 'string'
              }
            ],
            internalType: 'struct BtcMarketPlace.BitcoinAddress',
            name: 'bitcoinAddress',
            type: 'tuple'
          },
          {
            internalType: 'uint256',
            name: 'amountBtc',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'ercToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'ercAmount',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'requester',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'accepter',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'acceptTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct BtcMarketPlace.AcceptedBtcSellOrder[]',
        name: '',
        type: 'tuple[]'
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getOpenBtcBuyOrders',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amountBtc',
            type: 'uint256'
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'bitcoinAddress',
                type: 'string'
              }
            ],
            internalType: 'struct BtcMarketPlace.BitcoinAddress',
            name: 'bitcoinAddress',
            type: 'tuple'
          },
          {
            internalType: 'address',
            name: 'offeringToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'offeringAmount',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'requester',
            type: 'address'
          }
        ],
        internalType: 'struct BtcMarketPlace.BtcBuyOrder[]',
        name: '',
        type: 'tuple[]'
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getOpenBtcSellOrders',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amountBtc',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'askingToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'askingAmount',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'requester',
            type: 'address'
          }
        ],
        internalType: 'struct BtcMarketPlace.BtcSellOrder[]',
        name: '',
        type: 'tuple[]'
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'REQUEST_EXPIRATION_SECONDS',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;
