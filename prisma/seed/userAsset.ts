import { users } from "./user";

function createUser(id: string) {
  return {
    assetEntityId: 1,
    userId: id,
    quantity: 100000,
  };
}

const userAssets = users.map((user) => createUser(user.id));

export default userAssets;
