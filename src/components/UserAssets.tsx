import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

type Props = {
  showUsd: boolean;
};

const UserAssets: React.FC<Props> = ({ showUsd }) => {
  const { data: sessionData } = useSession();
  const { data } = trpc.userAsset.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const assets = data?.assets;
  const displayAssets = showUsd
    ? assets
    : assets?.filter((asset) => asset.symbol !== "USD");

  return (
    <table className="mx-auto">
      <tbody>
        <tr>
          <th className="w-24">Symbol</th>
          <th className="w-24">Value</th>
          <th className="w-24">Quantity</th>
          <th className="w-24">Price</th>
        </tr>

        {displayAssets?.map((asset) => (
          <tr key={asset.id}>
            <td className="text-center">{asset.symbol}</td>
            <td className="text-center">{asset.value}</td>
            <td className="text-center">{asset.quantity}</td>
            <td className="text-center">{asset.price}</td>
            <td>
              <button className="btn-primary">Sell</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserAssets;
