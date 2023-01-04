import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const EnterNameBanner: React.FC = () => {
  const { data: sessionData } = useSession();

  const user = sessionData?.user;
  const hasName = user?.name;

  const { pathname } = useRouter();

  const isOnEnterNamePage = pathname === "/enterName";

  if (!sessionData) return <></>;

  if (isOnEnterNamePage || hasName) return <></>;

  return (
    <div className="relative bg-red-300">
      <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="text-center">
            Please provide your name. Accounts without names are deleted in 7
            days.
          </div>
          <div className=" w-full flex-shrink-0 sm:mt-0 sm:w-auto">
            <Link
              href="/enterName"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
            >
              Enter Name
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterNameBanner;
