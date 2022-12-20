import { trpc } from "../utils/trpc";

const Leaderboard: React.FC = () => {
  const { data: ranks } = trpc.rank.get.useQuery(undefined);

  return (
    <div>
      <h2>Leaderboard</h2>
      <table>
        <tbody>
          <tr>
            <th className="w-24">Rank</th>
            <th className="w-24">Name</th>
            <th className="w-24">ROI</th>
          </tr>

          {ranks?.map((rank) => (
            <tr key={rank.rank}>
              <td className="text-center">{rank.rank}</td>
              <td className="text-center">{rank.userId}</td>
              <td className="text-center">{rank.roi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
