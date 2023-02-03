import type { User } from "@prisma/client";

import { faker } from "@faker-js/faker";

// create a fake user
function createUser(): Omit<User, "createdAt"> {
  const firstName = faker.name.firstName();
  const familyName = faker.name.lastName();
  const uniqueName = `${firstName}_${familyName}`.toLowerCase();
  return {
    id: faker.datatype.uuid(),
    email: faker.internet.email(),
    emailVerified: null,
    image: faker.internet.avatar(),
    firstName,
    familyName,
    uniqueName,
  };
}

// create 100 fake users
const users = Array.from({ length: 10 }, createUser);

export default users;
