import { users } from "./user";
import type { Rank } from "@prisma/client";

function createRank(id: string): Rank {
  return {
    rank: 1,
    userId: id,
    // a random number between -1 and 1
    roi: Math.round((Math.random() * 2 - 1) * 100) / 100,
    timestamp: new Date("2021-09-01T00:00:00.000Z"),
  };
}

const data = users.map((user) => createRank(user.id));

// sort and and rank property
data.sort((a, b) => b.roi - a.roi);
data.forEach((obj, index) => {
  obj.rank = index + 1;
});

export default data;
