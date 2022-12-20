import { AssetType } from "@prisma/client";

const data = [
  {
    id: 1,
    name: "US Dollar",
    symbol: "USD",
    assetType: AssetType.CASH,
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
];

export default data;
