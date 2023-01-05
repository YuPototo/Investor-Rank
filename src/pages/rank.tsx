import { type NextPage } from "next";
import Leaderboard from "../components/Leaderboard";

const Rank: NextPage = () => {
  return (
    <div className="mt-6 flex items-center">
      <div className="mx-auto w-[calc(100%_-_5em)] sm:w-2/3 md:w-1/2">
        <Leaderboard />
      </div>
    </div>
  );
};

export default Rank;
