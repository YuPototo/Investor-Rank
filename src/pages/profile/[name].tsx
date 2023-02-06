import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import UserAssetTable from "../../components/UserAssetTable";
import { toPercent } from "../../utils/numberFormatter/numberFormattter";
import { trpc } from "../../utils/trpc";

const Profile: NextPage = () => {
  // get user unique name
  const router = useRouter();
  const { name } = router.query;
  const { data } = trpc.rank.getPerformanceByUniqueName.useQuery(
    name as string,
    {
      enabled: name !== undefined,
    }
  );

  const { userName, userId, joinDate, headline, twitterLink } = data || {};

  // use sessionData
  const { data: sessionData } = useSession();

  const isUserPage = sessionData?.user?.id === userId;

  return (
    <div>
      <div className="mx-auto mt-6 w-10/12 md:w-1/2">
        <div className="mb-10">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            {userName}
          </h2>
          {isUserPage ? (
            <div className="mt-2">
              <Link className=" bg-blue-200 p-2" href="/editProfile">
                edit profile
              </Link>
            </div>
          ) : (
            <></>
          )}
          <div className="mt-2">{headline}</div>
          {twitterLink && (
            <div className="mt-2">
              <a href={twitterLink}>Twitter</a>
            </div>
          )}
          <div className="mt-2">
            <span className="mr-5">Join Date</span>
            <span>{joinDate}</span>
          </div>
        </div>

        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Performance
        </h3>
        {data && data.status === "unavailable" && (
          <div className="mt-5 text-gray-700">
            Available in a few minutes.
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
        {userId && <UserAssetTable userId={userId} showUsd showSellBtn />}
      </div>
    </div>
  );
};

export default Profile;
