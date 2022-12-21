import { useSession } from "next-auth/react";
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
      <h2 className="mb-4 text-center text-2xl font-bold">Portfolio</h2>

      <div className="mb-3 text-center">ROI: {roi}</div>

      <table className="mx-auto">
        <tbody>
          <tr>
            <th className="w-24">Symbol</th>
            <th className="w-24">Value</th>
            <th className="w-24">Quantity</th>
            <th className="w-24">Price</th>
          </tr>

          {assets?.map((asset) => (
            <tr key={asset.id}>
              <td className="text-center">{asset.symbol}</td>
              <td className="text-center">{asset.value}</td>
              <td className="text-center">{asset.quantity}</td>
              <td className="text-center">{asset.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;
