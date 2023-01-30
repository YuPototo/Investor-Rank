import type { User } from "@prisma/client";

import { faker } from "@faker-js/faker";

// create a fake user
function createUser(): Omit<User, "createdAt"> {
  return {
    id: faker.datatype.uuid(),
    email: faker.internet.email(),
    emailVerified: null,
    image: faker.internet.avatar(),
    firstName: faker.name.firstName(),
    familyName: faker.name.lastName(),
  };
}

// create 100 fake users
const users = Array.from({ length: 100 }, createUser);

export default users;
