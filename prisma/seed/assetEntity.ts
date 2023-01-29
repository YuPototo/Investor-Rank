import type { AssetEntity } from "@prisma/client";
import { AssetType } from "@prisma/client";

const data: AssetEntity[] = [
  {
    id: 1,
    name: "US Dollar",
    symbol: "USD",
    assetType: AssetType.CASH,
    buyable: false,
    price: 1,
  },
  {
    id: 2,
    name: "Bitcoin",
    symbol: "BTC",
    assetType: AssetType.CRYPTO,
    price: 20000,
    buyable: true,
  },
  {
    id: 3,
    name: "Ethereum",
    symbol: "ETH",
    assetType: AssetType.CRYPTO,
    price: 1000,
    buyable: true,
  },
  {
    id: 4,
    name: "Binance Coin",
    symbol: "BNB",
    assetType: AssetType.CRYPTO,
    price: 2,
    buyable: true,
  },
  {
    id: 5,
    name: "XRP",
    symbol: "XRP",
    assetType: AssetType.CRYPTO,
    price: 4,
    buyable: true,
  },
  {
    id: 6,
    name: "Dogecoin",
    symbol: "DOGE",
    assetType: AssetType.CRYPTO,
    price: 10,
    buyable: true,
  },
  {
    id: 7,
    name: "Cardano",
    symbol: "ADA",
    assetType: AssetType.CRYPTO,
    price: 12,
    buyable: true,
  },
  {
    id: 8,
    name: "Polygon",
    symbol: "MATIC",
    assetType: AssetType.CRYPTO,
    price: 14,
    buyable: true,
  },
  {
    id: 9,
    name: "Litecoin",
    symbol: "LTC",
    assetType: AssetType.CRYPTO,
    price: 15,
    buyable: true,
  },
  {
    id: 10,
    name: "Polkadot",
    symbol: "DOT",
    assetType: AssetType.CRYPTO,
    price: 10,
    buyable: true,
  },
  {
    id: 11,
    name: "Solana",
    symbol: "SOL",
    assetType: AssetType.CRYPTO,
    price: 11,
    buyable: true,
  },
];

export default data;
