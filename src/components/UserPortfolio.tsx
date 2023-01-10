import { useSession } from "next-auth/react";
import { toPercent } from "../utils/numberFormatter/numberFormattter";
import { trpc } from "../utils/trpc";
import UserAssets from "./UserAssets";

const Portfolio: React.FC = () => {
  const { data: sessionData } = useSession();
  const { data } = trpc.userAsset.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const roi = data?.roi;

  return (
    <div>
      <h2 className="mb-4 text-center text-2xl">Your Portfolio</h2>

      {roi !== undefined ? (
        <div className="mb-3 text-center">ROI: {toPercent(roi)}</div>
      ) : null}

      <UserAssets showUsd showSellBtn={false} />
    </div>
  );
};

export default Portfolio;
