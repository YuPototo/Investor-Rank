import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
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
      // create portfolio for user
      const portfolio = await prisma.portfolio.create({
        data: { userId: message.user.id },
      });

      // get dollar asset id
      const dollarAsset = await prisma.asset.findUnique({
        where: { code: "USD" },
      });

      if (!dollarAsset) {
        throw new Error("Dollar asset not found");
      }

      const initialAmount = 100000;

      // create dollar for user
      await prisma.portfolioAsset.create({
        data: {
          portfolioId: portfolio.id,
          assetId: dollarAsset.id,
          quantity: initialAmount,
        },
      });
    },
  },
};

export default NextAuth(authOptions);
