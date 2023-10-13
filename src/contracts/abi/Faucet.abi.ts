export const FaucetAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newErc20',
        type: 'address'
      }
    ],
    name: 'addErc20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;
