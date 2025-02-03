//@ts-ignore
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextApiRequest, NextApiResponse } from "next";
import { typeDefs } from "@/gql/typeDefs";
import { resolvers } from "@/gql/resolvers";
const { auth } = NextAuth(authConfig);

export const createContext = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await auth(req, res);
  return {
    prisma,
    user: session?.user,
  };
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    return await createContext(req, res);
  },
});
