import { toPercent } from "../utils/numberFormatter/numberFormattter";
import { trpc } from "../utils/trpc";

const Leaderboard: React.FC = () => {
  const { data: ranks } = trpc.rank.get.useQuery(undefined);

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
                  {ranks?.map((rank) => (
                    <tr key={rank.user.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {rank.rank}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">{`${rank.user.firstName} ${rank.user.familyName}`}</td>
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

export default Leaderboard;
