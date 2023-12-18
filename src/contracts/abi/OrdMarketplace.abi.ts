export const OrdMarketplaceAbi = [
  {
    inputs: [
      {
        internalType: 'contract IRelay',
        name: '_relay',
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
            internalType: 'bytes',
            name: 'scriptPubKey',
            type: 'bytes'
          }
        ],
        indexed: false,
        internalType: 'struct OrdMarketplace.BitcoinAddress',
        name: 'bitcoinAddress',
        type: 'tuple'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'ercToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'ercAmount',
        type: 'uint256'
      }
    ],
    name: 'acceptOrdinalSellOrderEvent',
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
    name: 'cancelAcceptedOrdinalSellOrderEvent',
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
        components: [
          {
            internalType: 'bytes32',
            name: 'txId',
            type: 'bytes32'
          },
          {
            internalType: 'uint32',
            name: 'index',
            type: 'uint32'
          }
        ],
        indexed: false,
        internalType: 'struct OrdMarketplace.OrdinalId',
        name: 'ordinalID',
        type: 'tuple'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'sellToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'sellAmount',
        type: 'uint256'
      }
    ],
    name: 'placeOrdinalSellOrderEvent',
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
    name: 'proofOrdinalSellOrderEvent',
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
    name: 'withdrawOrdinalSellOrderEvent',
    type: 'event'
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
            internalType: 'bytes',
            name: 'scriptPubKey',
            type: 'bytes'
          }
        ],
        internalType: 'struct OrdMarketplace.BitcoinAddress',
        name: 'bitcoinAddress',
        type: 'tuple'
      }
    ],
    name: 'acceptOrdinalSellOrder',
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
        name: '',
        type: 'uint256'
      }
    ],
    name: 'acceptedOrdinalSellOrders',
    outputs: [
      {
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'bytes',
            name: 'scriptPubKey',
            type: 'bytes'
          }
        ],
        internalType: 'struct OrdMarketplace.BitcoinAddress',
        name: 'bitcoinAddress',
        type: 'tuple'
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
        name: 'acceptor',
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
        name: 'id',
        type: 'uint256'
      }
    ],
    name: 'cancelAcceptedOrdinalSellOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getOpenAcceptedOrdinalSellOrders',
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
                internalType: 'bytes',
                name: 'scriptPubKey',
                type: 'bytes'
              }
            ],
            internalType: 'struct OrdMarketplace.BitcoinAddress',
            name: 'bitcoinAddress',
            type: 'tuple'
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
            name: 'acceptor',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'acceptTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct OrdMarketplace.AcceptedOrdinalSellOrder[]',
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
    name: 'getOpenOrdinalSellOrders',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'bytes32',
                name: 'txId',
                type: 'bytes32'
              },
              {
                internalType: 'uint32',
                name: 'index',
                type: 'uint32'
              }
            ],
            internalType: 'struct OrdMarketplace.OrdinalId',
            name: 'ordinalID',
            type: 'tuple'
          },
          {
            internalType: 'address',
            name: 'sellToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'sellAmount',
            type: 'uint256'
          },
          {
            components: [
              {
                internalType: 'bytes32',
                name: 'txHash',
                type: 'bytes32'
              },
              {
                internalType: 'uint32',
                name: 'txOutputIndex',
                type: 'uint32'
              },
              {
                internalType: 'uint64',
                name: 'txOutputValue',
                type: 'uint64'
              }
            ],
            internalType: 'struct BitcoinTx.UTXO',
            name: 'utxo',
            type: 'tuple'
          },
          {
            internalType: 'address',
            name: 'requester',
            type: 'address'
          },
          {
            internalType: 'bool',
            name: 'isOrderAccepted',
            type: 'bool'
          }
        ],
        internalType: 'struct OrdMarketplace.OrdinalSellOrder[]',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'ordinalSellOrders',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'txId',
            type: 'bytes32'
          },
          {
            internalType: 'uint32',
            name: 'index',
            type: 'uint32'
          }
        ],
        internalType: 'struct OrdMarketplace.OrdinalId',
        name: 'ordinalID',
        type: 'tuple'
      },
      {
        internalType: 'address',
        name: 'sellToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'sellAmount',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'txHash',
            type: 'bytes32'
          },
          {
            internalType: 'uint32',
            name: 'txOutputIndex',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'txOutputValue',
            type: 'uint64'
          }
        ],
        internalType: 'struct BitcoinTx.UTXO',
        name: 'utxo',
        type: 'tuple'
      },
      {
        internalType: 'address',
        name: 'requester',
        type: 'address'
      },
      {
        internalType: 'bool',
        name: 'isOrderAccepted',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'txId',
            type: 'bytes32'
          },
          {
            internalType: 'uint32',
            name: 'index',
            type: 'uint32'
          }
        ],
        internalType: 'struct OrdMarketplace.OrdinalId',
        name: 'ordinalID',
        type: 'tuple'
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'txHash',
            type: 'bytes32'
          },
          {
            internalType: 'uint32',
            name: 'txOutputIndex',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'txOutputValue',
            type: 'uint64'
          }
        ],
        internalType: 'struct BitcoinTx.UTXO',
        name: 'utxo',
        type: 'tuple'
      },
      {
        internalType: 'address',
        name: 'sellToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'sellAmount',
        type: 'uint256'
      }
    ],
    name: 'placeOrdinalSellOrder',
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
            internalType: 'bytes4',
            name: 'version',
            type: 'bytes4'
          },
          {
            internalType: 'bytes',
            name: 'inputVector',
            type: 'bytes'
          },
          {
            internalType: 'bytes',
            name: 'outputVector',
            type: 'bytes'
          },
          {
            internalType: 'bytes4',
            name: 'locktime',
            type: 'bytes4'
          }
        ],
        internalType: 'struct BitcoinTx.Info',
        name: 'transaction',
        type: 'tuple'
      },
      {
        components: [
          {
            internalType: 'bytes',
            name: 'merkleProof',
            type: 'bytes'
          },
          {
            internalType: 'uint256',
            name: 'txIndexInBlock',
            type: 'uint256'
          },
          {
            internalType: 'bytes',
            name: 'bitcoinHeaders',
            type: 'bytes'
          }
        ],
        internalType: 'struct BitcoinTx.Proof',
        name: 'proof',
        type: 'tuple'
      }
    ],
    name: 'proofOrdinalSellOrder',
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
    name: 'withdrawOrdinalSellOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;
