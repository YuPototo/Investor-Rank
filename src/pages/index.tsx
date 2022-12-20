import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Portfolio from "../components/UserPortfolio";
import BuyAsset from "../components/BuyAsset";
import Leaderboard from "../components/Leaderboard";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Investor Rank</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b ">
        <NavBar />

        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {sessionData === null ? <SignInCallOut /> : <Portfolio />}
        </div>

        <Leaderboard />

        <BuyAsset />
      </main>
    </>
  );
};

export default Home;

/**
 * Show this component when user is not sign in
 */
const SignInCallOut: React.FC = () => {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight ">Investor Rank</h1>
      <div>
        <button className="btn-primary" onClick={() => signIn()}>
          {"Sign in"}
        </button>
      </div>
    </>
  );
};

/**
 * NavBar
 */
const NavBar: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex h-16 w-full items-center bg-gray-300">
      <div className="ml-auto mr-5">
        <button
          className="btn-primary"
          onClick={sessionData ? () => signOut() : () => signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
    </div>
  );
};
