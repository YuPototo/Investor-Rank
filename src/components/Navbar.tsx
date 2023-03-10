import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import brandImage from "../../public/brand.png";
import Link from "next/link";

const Navbar: React.FC = () => {
  const { data: sessionData } = useSession();

  // tech debts: need to fix this ts-ignore
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const uniqueName = sessionData?.user?.uniqueName;

  return (
    <header className="bg-indigo-600">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        {/* brand icon */}
        <div className="flex w-full items-center justify-between border-b border-indigo-500 py-6 lg:border-none">
          <div className="flex justify-start">
            <Link href="/">
              <span className="sr-only">Investor Rank</span>
              <Image
                className="color-white"
                height={32}
                width={32}
                src={brandImage}
                alt="brand"
              ></Image>
            </Link>
          </div>

          {/* navbar item in lg screen */}
          {sessionData ? (
            <div className="flex items-center">
              <div className="ml-10 hidden space-x-12 lg:block">
                <Link
                  href="/trade"
                  className="text-base font-medium text-white hover:text-indigo-50"
                >
                  Trade
                </Link>
                <Link
                  href="/rank"
                  className="text-base font-medium text-white hover:text-indigo-50"
                >
                  Rank
                </Link>
                <Link
                  href={`/profile/${uniqueName}`}
                  className="text-base font-medium text-white hover:text-indigo-50"
                >
                  Profile
                </Link>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="ml-10 flex items-center space-x-4">
            {sessionData ? (
              <div className="ml-10 space-x-12 ">
                <Link
                  href={`/profile/${uniqueName}`}
                  className="text-base font-medium text-white hover:text-indigo-50"
                >
                  {sessionData.user?.name}
                </Link>
              </div>
            ) : (
              <></>
            )}
            <button
              onClick={sessionData ? () => signOut() : () => signIn()}
              className="inline-block rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-base font-medium text-white hover:bg-opacity-75"
            >
              {sessionData ? "Sign out" : "Sign In"}
            </button>
          </div>
        </div>

        {/* NavBar icon in small screen */}
        {sessionData ? (
          <div className="flex flex-wrap justify-center space-x-6 py-4 lg:hidden">
            <Link
              href="/trade"
              className="text-base font-medium text-white hover:text-indigo-50"
            >
              Trade
            </Link>
            <Link
              href="/rank"
              className="text-base font-medium text-white hover:text-indigo-50"
            >
              Rank
            </Link>
            <Link
              href={`/profile/${uniqueName}`}
              className="text-base font-medium text-white hover:text-indigo-50"
            >
              Profile
            </Link>
          </div>
        ) : (
          <></>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
