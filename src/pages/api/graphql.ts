//@ts-ignore
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
import { CreateUsers, DeleteUsers, UpdateUsers } from "@/lib/auth0";
import cuid from "cuid";

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

export const typeDefs = gql`
  type User {
    id: ID
    name: String
    email: String
    phone: String
    role: Role
    image: String
    movements: [Movement!]!
  }
  enum Role {
    ADMIN
    USER
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
    getMovements: [Movement]! # Todos los roles
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
    createUser(name: String!, email: String!, password: String!): User # Admin
    updateUser(
      id: ID!
      name: String
      role: Role
      phone: String
      image: String
    ): User! # Admin
    deleteUser(id: ID!): Boolean! # Admin
  }
  type Report {
    incomeTotal: Float!
    expenseTotal: Float!
    balance: Float!
    movements: [Movement!]!
  }

  type Query {
    getReport(startDate: String!, endDate: String!, userId: ID): Report!
  }
`;
// #endregion
//#region Resolvers

const resolvers: Resolvers = {
  Query: {
    async getUsers(_, __, { prisma, user }) {
      checkRole(user, "ADMIN");
      return prisma.user.findMany({
        include: { movements: true },
      });
    },
    async getUserById(_, { id }, { prisma, user }) {
      return prisma.user.findUnique({ where: { id } });
    },
    async getMovements(_, __, { prisma, user }) {
      const data = await prisma.movement.findMany({
        where: { userId: user.id },
        include: { user: true },
      });
      console.log({ data });
      return data;
    },
    async getMovementById(_, { id }, { prisma, user }) {
      const movement = await prisma.movement.findUnique({ where: { id },
      include:{user:true} });
      return movement;
    },
    getReport: async (_, { startDate, endDate, userId }, { prisma }) => {
      // Convertir fechas
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Filtrar movimientos
      const movements = (await prisma.movement.findMany({
        where: {
          userId: userId || undefined, // Filtrar por usuario si se pasa
          date: {
            gte: start, // Fecha inicio
            lte: end, // Fecha fin
          },
        },
        include: { user: true },
      })) as [{ amount: number; type: string }];

      const incomeTotal = movements
        .filter((m) => m.type === "INCOME")
        .reduce((sum, m) => sum + m.amount, 0);

      const expenseTotal = movements
        .filter((m) => m.type === "EXPENSE")
        .reduce((sum, m) => sum + m.amount, 0);

      const balance = incomeTotal - expenseTotal;

      // Retornar datos
      return {
        incomeTotal,
        expenseTotal,
        balance,
        movements,
      };
    },
  },
  Mutation: {
    async createMovement(_, { concept, amount, date, type }, { prisma, user }) {
      return prisma.movement.create({
        data: { concept, amount, date: new Date(date), type, userId: user.id },
        include: { user: true },
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
    async createUser(
      _,
      {
        name,
        email,
        password,
      }: { name: string; email: string; password: string },
      { prisma, user }
    ) {
      const given_name = name.split(" ")[0];
      const family_name = name.split(" ")[1];

      const data = await CreateUsers({
        email,
        name,
        given_name,
        family_name,
        nickname: name,
        picture: "https://cdn.fakercloud.com/avatars/1.png",
        password,
        connection: "Username-Password-Authentication",
        verify_email: true,
        user_metadata: {},
        app_metadata: {},
      });
      console.log(data);

      return {
        id: data.identities[0].user_id,
        name: data.name,
        email: data.email,
        role: "USER",
        image: data.picture,
      };
    },
    async updateUser(_, { id, name, role, phone, image }, { prisma, user }) {
      checkRole(user, "ADMIN");
      return prisma.user.update({
        where: { id },
        data: { name, role, phone, image },
      });
    },
    async deleteUser(_, { id }, { prisma, user }) {
      const userDeleted = await DeleteUsers(id);
      console.log({ userDeleted });
      if (!userDeleted) return false;
      const data = await prisma.user.delete({ where: { id } });
      console.debug(data);
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
