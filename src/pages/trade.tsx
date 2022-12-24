import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import UserAssets from "../components/UserAssets";
import { trpc } from "../utils/trpc";

const Trade: NextPage = () => {
  const { data: sessionData } = useSession();

  // get user balance
  const { data: balanceRes } = trpc.userAsset.getBalance.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });
  const balance = balanceRes?.balance;

  // get buyable assets
  const { data: buyableAssets } = trpc.assetEntity.getBuyable.useQuery();

  // get user assets
  const { data } = trpc.userAsset.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const assets = data?.assets;
  const hasAssets = assets?.length && assets?.length > 1;

  return (
    <div>
      {balance !== undefined && (
        <div className="mt-6 text-center font-bold">
          Your balance: ${balance}
        </div>
      )}

      <div className="flex">
        <div className="w-1/2">
          <h2 className="mb-4 font-bold">Buy</h2>
          {buyableAssets?.map((asset) => (
            <div className="my-2 flex items-center gap-4" key={asset.id}>
              <div>{asset.symbol}</div>
              <div>{asset.price}</div>
              <button className="btn-primary">Buy</button>
            </div>
          ))}
        </div>

        <div className="w-1/2">
          <h2 className="mb-4 text-center font-bold">Sell</h2>
          {hasAssets ? (
            <UserAssets showUsd={false} />
          ) : (
            <div className="text-center">No sellable assets</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trade;
