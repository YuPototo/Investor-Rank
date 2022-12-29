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
    priceTimeId: 1,
  },
  {
    id: 2,
    assetEntityId: assetEntityId.USD,
    price: 1,
    priceTimeId: 2,
  },
];

const btcPrices = [
  {
    id: 3,
    assetEntityId: assetEntityId.BTC,
    price: 10000,
    priceTimeId: 1,
  },
  {
    id: 4,
    assetEntityId: assetEntityId.BTC,
    price: 20000,
    priceTimeId: 2,
  },
];

const ethPrices = [
  {
    id: 5,
    assetEntityId: assetEntityId.ETH,
    price: 1000,
    priceTimeId: 1,
  },
  {
    id: 6,
    assetEntityId: assetEntityId.ETH,
    price: 2000,
    priceTimeId: 2,
  },
];

const data = [...usdPrices, ...btcPrices, ...ethPrices];

export default data;
