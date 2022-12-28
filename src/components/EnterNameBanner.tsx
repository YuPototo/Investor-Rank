import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const EnterNameBanner: React.FC = () => {
  const { data: sessionData } = useSession();
  const user = sessionData?.user;
  const hasName = user?.name;

  const { pathname } = useRouter();
  const isOnEnterNamePage = pathname === "/enterName";

  if (hasName || isOnEnterNamePage) return <></>;

  return (
    <div className="flex w-full items-center justify-center gap-4 bg-red-100 p-2 text-center">
      <div>
        This is a platform for real people. Please enter your name. Accounts
        without name will be deleted in 7 days.
      </div>
      <Link className="btn-primary" href="/enterName">
        Enter Name
      </Link>
    </div>
  );
};

export default EnterNameBanner;
