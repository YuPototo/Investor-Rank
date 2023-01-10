import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import BuyableAssets from "../components/BuyableAssets";
import UserAssetTable from "../components/UserAssetTable";
import { trpc } from "../utils/trpc";

const Trade: NextPage = () => {
  const { data: sessionData } = useSession();

  // get user balance
  const { data: balanceRes } = trpc.userAsset.getBalance.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });
  const balance = balanceRes?.balance;

  // get user assets
  const { data } = trpc.userAsset.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const assets = data?.assets;
  const hasAssets = assets?.length && assets?.length > 1;

  return (
    <div className="pb-16">
      {balance !== undefined && (
        <div className="my-6 text-center">Your balance: ${balance}</div>
      )}

      <div className="flex flex-col gap-14 md:flex-row md:gap-4">
        <div className="mx-5 w-[calc(100%_-_10)] sm:w-1/2 ">
          <h2 className="mb-6 text-center font-bold text-indigo-600">Buy</h2>
          <BuyableAssets />
        </div>

        <div className="mx-5 w-[calc(100%_-_10)] sm:w-1/2 ">
          <h2 className="mb-6 text-center font-bold text-indigo-600">Sell</h2>
          {hasAssets ? (
            <UserAssetTable showUsd={false} showSellBtn />
          ) : (
            <div className="text-center">No sellable assets</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trade;
