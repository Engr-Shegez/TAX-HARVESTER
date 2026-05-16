const MOCK_HOLDINGS = [
  {
    id: "eth",
    coin: "ETH",
    coinName: "Ethereum",
    chain: "Ethereum",
    source: "Coinbase",
    logo: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
    currentPrice: 2161.82,
    taxLots: [
      {
        id: "eth-2023-02-11",
        acquiredAt: "2023-02-11",
        quantity: 0.72,
        costBasisPerUnit: 3080.44,
        fees: 14.5,
        source: "Coinbase",
      },
      {
        id: "eth-2024-08-18",
        acquiredAt: "2024-08-18",
        quantity: 0.38,
        costBasisPerUnit: 2635.2,
        fees: 8.2,
        source: "Coinbase",
      },
    ],
  },
  {
    id: "sol",
    coin: "SOL",
    coinName: "Solana",
    chain: "Solana",
    source: "Phantom",
    logo: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756",
    currentPrice: 147.58,
    taxLots: [
      {
        id: "sol-2024-03-04",
        acquiredAt: "2024-03-04",
        quantity: 18.5,
        costBasisPerUnit: 184.9,
        fees: 5.1,
        source: "Phantom",
      },
      {
        id: "sol-2025-01-14",
        acquiredAt: "2025-01-14",
        quantity: 11.2,
        costBasisPerUnit: 121.35,
        fees: 3.4,
        source: "Phantom",
      },
    ],
  },
  {
    id: "matic",
    coin: "MATIC",
    coinName: "Polygon",
    chain: "Polygon",
    source: "Metamask",
    logo: "https://coin-images.coingecko.com/coins/images/4713/large/polygon.png?1698233745",
    currentPrice: 0.2222,
    taxLots: [
      {
        id: "matic-2022-11-06",
        acquiredAt: "2022-11-06",
        quantity: 6200,
        costBasisPerUnit: 0.91,
        fees: 7.3,
        source: "Metamask",
      },
      {
        id: "matic-2025-04-09",
        acquiredAt: "2025-04-09",
        quantity: 2400,
        costBasisPerUnit: 0.31,
        fees: 2.2,
        source: "Metamask",
      },
    ],
  },
  {
    id: "link",
    coin: "LINK",
    coinName: "Chainlink",
    chain: "Ethereum",
    source: "Kraken",
    logo: "https://coin-images.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1696502009",
    currentPrice: 14.5,
    taxLots: [
      {
        id: "link-2023-12-19",
        acquiredAt: "2023-12-19",
        quantity: 95,
        costBasisPerUnit: 17.86,
        fees: 6.75,
        source: "Kraken",
      },
      {
        id: "link-2025-07-21",
        acquiredAt: "2025-07-21",
        quantity: 48,
        costBasisPerUnit: 12.2,
        fees: 2.8,
        source: "Kraken",
      },
    ],
  },
  {
    id: "usdc",
    coin: "USDC",
    coinName: "USD Coin",
    chain: "Base",
    source: "Coinbase",
    logo: "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
    currentPrice: 1,
    taxLots: [
      {
        id: "usdc-2025-02-07",
        acquiredAt: "2025-02-07",
        quantity: 4200,
        costBasisPerUnit: 1,
        fees: 0,
        source: "Coinbase",
      },
    ],
  },
  {
    id: "arb",
    coin: "ARB",
    coinName: "Arbitrum",
    chain: "Arbitrum",
    source: "Metamask",
    logo: "https://coin-images.coingecko.com/coins/images/16547/large/arb.jpg?1721358242",
    currentPrice: 0.39,
    taxLots: [
      {
        id: "arb-2024-04-03",
        acquiredAt: "2024-04-03",
        quantity: 3100,
        costBasisPerUnit: 1.31,
        fees: 4.3,
        source: "Metamask",
      },
    ],
  },
];

const MOCK_CAPITAL_GAINS = {
  stcg: {
    profits: 70200.88,
    losses: 1548.53,
  },
  ltcg: {
    profits: 5020,
    losses: 3050,
  },
};

const MOCK_TRANSACTIONS = [
  {
    id: "tx-1001",
    date: "2025-11-18",
    type: "buy",
    asset: "SOL",
    quantity: 11.2,
    value: 1359.12,
    fee: 3.4,
    source: "Phantom",
    status: "matched",
  },
  {
    id: "tx-1002",
    date: "2025-09-02",
    type: "swap",
    asset: "ARB",
    quantity: 3100,
    value: 4061,
    fee: 4.3,
    source: "Metamask",
    status: "matched",
  },
  {
    id: "tx-1003",
    date: "2025-07-21",
    type: "buy",
    asset: "LINK",
    quantity: 48,
    value: 585.6,
    fee: 2.8,
    source: "Kraken",
    status: "matched",
  },
  {
    id: "tx-1004",
    date: "2025-02-07",
    type: "deposit",
    asset: "USDC",
    quantity: 4200,
    value: 4200,
    fee: 0,
    source: "Coinbase",
    status: "review",
  },
  {
    id: "tx-1005",
    date: "2024-08-18",
    type: "buy",
    asset: "ETH",
    quantity: 0.38,
    value: 1001.38,
    fee: 8.2,
    source: "Coinbase",
    status: "matched",
  },
];

const MOCK_SETTINGS = {
  accountingMethod: "HIFO",
  taxYear: "2026",
  baseCurrency: "USD",
  jurisdiction: "US",
  hideDust: true,
  maxSaleValue: 10000,
  lossOnly: true,
};

export const fetchHoldings = async () => MOCK_HOLDINGS;

export const fetchCapitalGains = async () => MOCK_CAPITAL_GAINS;

export const fetchTransactions = async () => MOCK_TRANSACTIONS;

export const fetchSettings = async () => MOCK_SETTINGS;
