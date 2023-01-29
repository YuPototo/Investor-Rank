import { users } from "./user";
import type { UserAsset } from "@prisma/client";

function createUser(id: string): Omit<UserAsset, "id"> {
  return {
    assetEntityId: 1,
    userId: id,
    quantity: 100000,
  };
}

const userAssets = users.map((user) => createUser(user.id));

export default userAssets;
