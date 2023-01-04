import { useSession } from "next-auth/react";
import { toPercent } from "../utils/numberFormatter/numberFormattter";
import { trpc } from "../utils/trpc";

const Portfolio: React.FC = () => {
  const { data: sessionData } = useSession();
  const { data } = trpc.userAsset.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const assets = data?.assets;
  const roi = data?.roi;

  return (
    <div>
      <h2 className="mb-4 text-center text-2xl">Your Portfolio</h2>

      {roi !== undefined ? (
        <div className="mb-3 text-center">ROI: {toPercent(roi)}</div>
      ) : null}

      <div className="mt-8 flex flex-col">
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
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {assets?.map((asset) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
