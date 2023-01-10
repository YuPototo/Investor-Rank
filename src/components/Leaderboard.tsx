import { toPercent } from "../utils/numberFormatter/numberFormattter";
import { trpc } from "../utils/trpc";

const Leaderboard: React.FC = () => {
  const { data: ranks, isLoading } = trpc.rank.get.useQuery(undefined);

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl">Leaderboard</h2>

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
                      Rank
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      ROI
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {isLoading ? <LeaderBoardSkeleton /> : <></>}
                  {ranks?.map((rank) => (
                    <tr key={rank.user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                        {rank.rank}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-900  ">
                        {getFullName(rank.user.firstName, rank.user.familyName)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {toPercent(rank.roi)}
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

function getFullName(
  firstName: string | null,
  familyName: string | null
): string {
  if (!firstName || !familyName) return "unnamed";
  return firstName + " " + familyName;
}

const LeaderBoardSkeleton: React.FC = () => {
  // a array of 10 elements
  const arr = Array.from(Array(6).keys());

  return (
    <>
      {arr.map((i) => (
        <tr className="animate-pulse" key={i}>
          <td className="whitespace-nowrap py-2  pl-4 text-sm text-gray-500 sm:pl-6">
            <div className="h-6 w-12 rounded-full bg-gray-300"></div>
          </td>
          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
            <div className="h-6 w-24 rounded-full bg-gray-300"></div>
          </td>
          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
            <div className="h-6 w-14 rounded-full bg-gray-300"></div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default Leaderboard;
