import { AssetType } from "@prisma/client";

const data = [
  {
    id: 1,
    name: "US Dollar",
    symbol: "USD",
    assetType: AssetType.CASH,
    buyable: false,
  },
  {
    id: 2,
    name: "Bitcoin",
    symbol: "BTC",
    assetType: AssetType.CRYPTO,
  },
  {
    id: 3,
    name: "Ethereum",
    symbol: "ETH",
    assetType: AssetType.CRYPTO,
  },
  {
    id: 4,
    name: "Binance Coin",
    symbol: "BNB",
    assetType: AssetType.CRYPTO,
  },
  {
    id: 5,
    name: "XRP",
    symbol: "XRP",
    assetType: AssetType.CRYPTO,
  },
  {
    id: 6,
    name: "Dogecoin",
    symbol: "DOGE",
    assetType: AssetType.CRYPTO,
  },
  {
    id: 7,
    name: "Cardano",
    symbol: "ADA",
    assetType: AssetType.CRYPTO,
  },
  {
    id: 8,
    name: "Polygon",
    symbol: "MATIC",
    assetType: AssetType.CRYPTO,
  },
  {
    id: 9,
    name: "Litecoin",
    symbol: "LTC",
    assetType: AssetType.CRYPTO,
  },
  {
    id: 10,
    name: "Polkadot",
    symbol: "DOT",
    assetType: AssetType.CRYPTO,
  },
  {
    id: 11,
    name: "Solana",
    symbol: "SOL",
    assetType: AssetType.CRYPTO,
  },
];

export default data;
