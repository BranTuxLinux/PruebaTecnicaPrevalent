import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { gql } from "graphql-tag";
//#region TypeDefs
import { prisma } from "@/lib/prisma";
import { Resolvers } from "@apollo/client";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextApiRequest, NextApiResponse } from "next";
import { checkRole } from "@/utils/checkRol";
import Error from "next/error";

const { auth } = NextAuth(authConfig);

export const createContext = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await auth(req, res);
  console.log(session);
  return {
    prisma,
    user: session?.user,
  };
};

export const typeDefs = gql`
  type User {
    id: ID!
    name: String
    email: String
    role: String
    image: String
    movements: [Movement!]!
  }

  type Movement {
    id: ID!
    concept: String!
    amount: Float!
    date: String!
    type: MovementType!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  enum MovementType {
    INCOME
    EXPENSE
  }

  type Query {
    getUsers: [User]! # Solo para administradores
    getUserById(id: ID!): User # Solo para administradores
    getMovements: [Movement!]! # Todos los roles
    getMovementById(id: ID!): Movement # Todos los roles
  }

  type Mutation {
    createMovement(
      concept: String!
      amount: Float!
      date: String!
      type: MovementType!
    ): Movement! # Admin
    updateMovement(
      id: ID!
      concept: String
      amount: Float
      date: String
      type: MovementType
    ): Movement! # Admin
    deleteMovement(id: ID!): Boolean! # Admin
    createUser(name: String!, email: String!, role: String!): User! # Admin
    updateUser(id: ID!, name: String, role: String): User! # Admin
    deleteUser(id: ID!): Boolean! # Admin
  }
`;
// #endregion
//#region Resolvers

const resolvers: Resolvers = {
  Query: {
    async getUsers(_, __, { prisma, user }) {
      checkRole(user, "ADMIN");
      return prisma.user.findMany();
    },
    async getUserById(_, { id }, { prisma, user }) {
      return prisma.user.findUnique({ where: { id } });
    },
    async getMovements(_, __, { prisma, user }) {
      return prisma.movement.findMany({ where: { userId: user.id } });
    },
    async getMovementById(_, { id }, { prisma, user }) {
      const movement = await prisma.movement.findUnique({ where: { id } });
      return movement;
    },
  },
  Mutation: {
    async createMovement(_, { concept, amount, date, type }, { prisma, user }) {
      return prisma.movement.create({
        data: { concept, amount, date: new Date(date), type, userId: user.id },
      });
    },
    async updateMovement(
      _,
      { id, concept, amount, date, type },
      { prisma, user }
    ) {
      const movement = await prisma.movement.findUnique({ where: { id } });
      return prisma.movement.update({
        where: { id },
        data: {
          concept,
          amount,
          date: date ? new Date(date) : undefined,
          type,
        },
      });
    },
    async deleteMovement(_, { id }, { prisma, user }) {
      const movement = await prisma.movement.findUnique({ where: { id } });
      await prisma.movement.delete({ where: { id } });
      return true;
    },
    async createUser(_, { name, email, role }, { prisma, user }) {
      return prisma.user.create({
        data: { name, email, role },
      });
    },
    async updateUser(_, { id, name, role }, { prisma, user }) {
      return prisma.user.update({
        where: { id },
        data: { name, role },
      });
    },
    async deleteUser(_, { id }, { prisma, user }) {
      await prisma.user.delete({ where: { id } });
      return true;
    },
  },
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
