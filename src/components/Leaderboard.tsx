import { trpc } from "../utils/trpc";

const Leaderboard: React.FC = () => {
  const { data: ranks } = trpc.rank.get.useQuery(undefined);

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold">Leaderboard</h2>
      <table className="mx-auto">
        <tbody>
          <tr>
            <th className="w-24">Rank</th>
            <th className="w-24">Name</th>
            <th className="w-24">ROI</th>
          </tr>

          {ranks?.map((rank) => (
            <tr key={rank.rank}>
              <td className="text-center">{rank.rank}</td>
              <td className="text-center">{`${rank.user.firstName} ${rank.user.familyName}`}</td>
              <td className="text-center">{rank.roi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
