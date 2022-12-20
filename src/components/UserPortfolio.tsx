import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Portfolio: React.FC = () => {
  const { data: sessionData } = useSession();
  const { data: userAssets } = trpc.userAsset.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  return (
    <div>
      <h2 className="text-bold text-center text-lg">Portfolio</h2>

      <table>
        <tbody>
          <tr>
            <th className="w-24">Symbol</th>
            <th className="w-24">Value</th>
            <th className="w-24">Quantity</th>
            <th className="w-24">Price</th>
          </tr>

          {userAssets?.map((asset) => (
            <tr key={asset.id}>
              <td className="text-center">{asset.symbol}</td>
              <td className="text-center">todo</td>
              <td className="text-center">{asset.quantity}</td>
              <td className="text-center">todo</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;
