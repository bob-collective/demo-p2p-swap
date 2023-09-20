export const MarketplaceAbi = [
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "acceptErcErcOrder",
    inputs: [
      { type: "uint256", name: "id", internalType: "uint256" },
      { type: "uint256", name: "saleAmount", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "uint256", name: "offeringAmount", internalType: "uint256" },
      { type: "address", name: "offeringToken", internalType: "address" },
      { type: "uint256", name: "askingAmount", internalType: "uint256" },
      { type: "address", name: "askingToken", internalType: "address" },
      { type: "address", name: "requesterAddress", internalType: "address" },
    ],
    name: "ercErcOrders",
    inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "placeErcErcOrder",
    inputs: [
      { type: "address", name: "sellingToken", internalType: "address" },
      { type: "uint256", name: "saleAmount", internalType: "uint256" },
      { type: "address", name: "buyingToken", internalType: "address" },
      { type: "uint256", name: "buyAmount", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "withdrawErcErcOrder",
    inputs: [{ type: "uint256", name: "id", internalType: "uint256" }],
  },
] as const;
