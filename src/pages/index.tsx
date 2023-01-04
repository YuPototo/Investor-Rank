import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import Portfolio from "../components/UserPortfolio";
import Leaderboard from "../components/Leaderboard";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Investor Rank</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-full bg-gray-50">
        <div className="container mx-auto flex w-full flex-col justify-center gap-12 px-4 py-16 sm:flex-row">
          <div className="w-full sm:w-1/2">
            {sessionData === null ? (
              <SignInCallOut />
            ) : (
              <>
                <Portfolio />
                <div className="mt-10 text-center">
                  <Link className="btn-primary" href="/trade">
                    Go to trade
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="mx-5 w-[calc(100%_-_10)] sm:w-1/2 ">
            <Leaderboard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

/**
 * Show this component when user is not sign in
 */
const SignInCallOut: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-5 text-3xl  tracking-tight">Investor Rank</h2>
      <div className="mb-6 flex flex-col gap-3 text-center">
        <div>
          Trade with <span className="font-bold text-indigo-600">fake</span>{" "}
          money
        </div>
        <div>
          With <span className="font-bold text-indigo-600">real</span> world
          asset price
        </div>
        <div>
          Under your <span className="font-bold text-indigo-600">real</span>{" "}
          name
        </div>
        <div>
          Your trading history is{" "}
          <span className="font-bold text-indigo-600">public</span>
        </div>
      </div>
      <div>
        <button
          type="button"
          className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => signIn()}
        >
          JOIN
        </button>
      </div>
    </div>
  );
};
