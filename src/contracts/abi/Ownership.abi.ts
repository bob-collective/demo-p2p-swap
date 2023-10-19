export const OwnershipAbi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'taprootAddress',
        type: 'string'
      }
    ],
    name: 'claimOwnershipWithoutProofThisIsAHackForTesting',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'ownedAddress',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;
