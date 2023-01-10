import { useSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "../utils/trpc";

type Props = {
  showUsd: boolean;
  showSellBtn: boolean;
};

const UserAssets: React.FC<Props> = ({ showUsd, showSellBtn }) => {
  const { data: sessionData } = useSession();
  const { data, isLoading } = trpc.userAsset.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const assets = data?.assets;
  const displayAssets = showUsd
    ? assets
    : assets?.filter((asset) => asset.symbol !== "USD");

  return (
    <div className="flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Symbol
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Value
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Price
                  </th>
                  {showSellBtn ? (
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">Sell</span>
                    </th>
                  ) : (
                    <></>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? <AssetSkeleton /> : <></>}
                {displayAssets?.map((asset) => (
                  <tr key={asset.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                      {asset.symbol}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      ${asset.value}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {asset.quantity}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      ${asset.price}
                    </td>
                    {showSellBtn ? (
                      <td>
                        {asset.symbol === "USD" ? null : (
                          <Link
                            href={`/sell/${asset.symbol}`}
                            className="inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Sell
                          </Link>
                        )}
                      </td>
                    ) : (
                      <></>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const AssetSkeleton: React.FC = () => {
  // a array of 6 elements
  const arr = Array.from(Array(6).keys());

  return (
    <>
      {arr.map((i) => (
        <tr className="animate-pulse" key={i}>
          <td className="whitespace-nowrap py-2  pl-4 text-sm text-gray-500 sm:pl-6">
            <div className="h-6 w-10 rounded-full bg-gray-300"></div>
          </td>
          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
            <div className="h-6 w-16 rounded-full bg-gray-300"></div>
          </td>
          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
            <div className="h-6 w-16 rounded-full bg-gray-300"></div>
          </td>
          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
            <div className="h-6 w-16 rounded-full bg-gray-300"></div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default UserAssets;
