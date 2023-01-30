import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import getDollarId from "../../../server/utils/getDollarId";
import getInitialDollar from "../../../server/utils/getInitialDollar";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // ! user typing is wrong
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (hasName(user.firstName, user.lastName)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          session.user.name = `${user.firstName} ${user.familyName}`;
        }
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,

      // profile callback is modified to remove username
      // code is copied from discord provider's source code
      profile(profile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith("a_") ? "gif" : "png";
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }

        return {
          id: profile.id,
          email: profile.email,
          image: profile.image_url,
        };
      },
    }),
  ],
  events: {
    async createUser(message) {
      // get dollar asset id
      const initialDollarId = await getDollarId(prisma);

      // get initial dollar param
      const initialDollar = await getInitialDollar(prisma);

      // create dollar for user
      await prisma.userAsset.create({
        data: {
          userId: message.user.id,
          assetEntityId: initialDollarId,
          quantity: initialDollar,
        },
      });
    },
  },
};

function hasName(firstName: string | null, lastName: string | null): boolean {
  return firstName !== null && lastName !== null;
}

export default NextAuth(authOptions);
