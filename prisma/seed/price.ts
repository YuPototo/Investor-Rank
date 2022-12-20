const assetEntityId = {
  USD: 1,
  BTC: 2,
  ETH: 3,
};

const usdPrices = [
  {
    id: 1,
    assetEntityId: assetEntityId.USD,
    price: 1,
    timestamp: new Date(),
  },
];

const btcPrices = [
  {
    id: 2,
    assetEntityId: assetEntityId.BTC,
    price: 50000,
    timestamp: new Date("2021-01-01"),
  },
  {
    id: 3,
    assetEntityId: assetEntityId.BTC,
    price: 50000,
    timestamp: new Date(),
  },
];

const ethPrices = [
  {
    id: 4,
    assetEntityId: assetEntityId.ETH,
    price: 1000,
    timestamp: new Date("2021-01-01"),
  },
  {
    id: 5,
    assetEntityId: assetEntityId.ETH,
    price: 2000,
    timestamp: new Date(),
  },
];

const data = [...usdPrices, ...btcPrices, ...ethPrices];

export default data;
