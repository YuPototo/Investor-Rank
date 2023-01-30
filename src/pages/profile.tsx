import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import UserAssetTable from "../components/UserAssetTable";
import { toPercent } from "../utils/numberFormatter/numberFormattter";
import { trpc } from "../utils/trpc";

const Portfolio: NextPage = () => {
  const { data: sessionData } = useSession();

  const userId = sessionData?.user?.id;
  const { data } = trpc.rank.getPerformanceByUser.useQuery(userId as string, {
    enabled: userId !== undefined,
  });

  return (
    <div>
      <div className="mx-auto mt-6 w-10/12 md:w-1/2">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Performance
        </h3>
        {data && data.status === "unavailable" && (
          <div className="mt-5 text-gray-700">
            Your performance metrics will be available in a few minutes.
          </div>
        )}
        {data && data.status === "success" && (
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Rank
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                <div>{`${data.rank} / ${data.userCount}`}</div>
              </dd>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                ROI
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                <div>{toPercent(data.roi)}</div>
              </dd>
            </div>
          </dl>
        )}
      </div>

      <div className="mx-auto mt-16 w-10/12 md:w-1/2">
        <h3 className=" mb-6 text-lg font-medium leading-6 text-gray-900">
          Assets
        </h3>
        <UserAssetTable showUsd showSellBtn />
      </div>
    </div>
  );
};

export default Portfolio;
