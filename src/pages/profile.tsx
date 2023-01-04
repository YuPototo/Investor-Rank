import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import UserAssets from "../components/UserAssets";
import { trpc } from "../utils/trpc";

const Portfolio: NextPage = () => {
  const { data: sessionData } = useSession();

  const userId = sessionData?.user?.id;
  const { data } = trpc.rank.getPerformanceByUser.useQuery(userId as string, {
    enabled: userId !== undefined,
  });

  return (
    <div>
      <h1>Portfolio</h1>
      <div>
        <h2>Performance</h2>
        <div className="flex gap-4">
          <div>Rank</div>
          {data && <div>{`${data.rank} / ${data.userCount}`}</div>}
        </div>
        <div className="flex gap-4">
          <div>ROI</div>
          {data && <div>{data.roi}</div>}
        </div>
      </div>

      <div>
        <h1>Assets</h1>
        <UserAssets showUsd />
      </div>
    </div>
  );
};

export default Portfolio;
