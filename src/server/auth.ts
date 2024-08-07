/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";

import
{
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';

import { env } from "@/env";
import { db } from "@/server/db";
import { JWT } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession
  {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
      username: string;
      scope: string;
      firstName: string;
      lastName: string;
      exchangeId: string;
    } & DefaultSession["user"];
  }

  interface User
  {
    // ...other properties
    // role: UserRole;
    scope: string;
    username: string;
    exchange: {
      id: string;
    };
    user: {
      firstName: string;
      lastName: string;
    };
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token })
    {
      if (token)
      {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.scope = token.scope as string;
        session.user.exchangeId = token.exchangeId as string;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
    jwt({ token, user }): JWT
    {
      // Before adding here you need to add to the session callback above
      // and you need to add to the user Type above.
      if (user)
      {
        token.id = user.id;
        token.firstName = user.user.firstName;
        token.lastName = user.user.lastName;
        token.scope = user.scope;
        token.username = user.username;
        token.exchangeId = user.exchange?.id;

      }
      return token;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [


    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<any>
      {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const findAccount = await db.account.findFirst({
          where: {
            username: String(credentials?.username),
          }, include: {
            exchange: true,
            user: true,
          }
        }).then((accountRes) =>
        {
          console.log(accountRes);
          return accountRes;
        }).catch((e) => console.log(e));
        // const findUser = await db.user.findFirst({
        //   where: {
        //     id: findAccount?.userId
        //   }
        // }).then((userRes) =>
        // {
        //   if (findAccount?.scope === 'PARENT')
        //   {
        //   }

        //   return userRes;
        // }).catch((e) => console.log(e));
        const checkPwd = bcrypt.compareSync(String(credentials?.password), String(findAccount?.password));

        if (checkPwd) 
        {
          return findAccount;
        } else return null;

        // If no error and we have user data, return it

        // Return null if user data could not be retrieved

      }
    })


    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: '/signin'
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 * 7, // 7 days
  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) =>
{
  return getServerSession(ctx.req, ctx.res, authOptions);
};

