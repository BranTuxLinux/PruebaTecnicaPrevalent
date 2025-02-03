import { checkRole } from "@/utils/checkRol";
import { Resolvers } from "@apollo/client";
export const resolvers: Resolvers = {
  Query: {
    async getUsers(_, __, { prisma, user }) {
      checkRole(user, "ADMIN");
      return prisma.user.findMany({
        include: { movements: true },
      });
    },
    async getUserById(_, { id }, { prisma, user }) {
      checkRole(user, "ADMIN");
      return prisma.user.findUnique({ where: { id } });
    },
    async getMovements(_, __, { prisma, user }) {
      const data = await prisma.movement.findMany({
        include: { user: true },
      });
      return data;
    },
    async getMovementById(_, { id }, { prisma, user }) {
      const movement = await prisma.movement.findUnique({
        where: { id: id },
        include: { user: true },
      });
      return movement;
    },
    getReport: async (_, { startDate, endDate, userId }, { prisma, user }) => {
      checkRole(user, "ADMIN");
      const start = new Date(startDate);
      const end = new Date(endDate);

      console.table({ start: start, end: end });
      const movements = (await prisma.movement.findMany({
        where: {
          userId: userId || undefined,
          date: {
            gte: start,
            lte: end,
          },
        },
        include: { user: true },
      })) as [{ amount: number; type: string }];
      console.log(movements);

      const incomeTotal = movements
        .filter((m) => m.type === "INCOME")
        .reduce((sum, m) => sum + m.amount, 0);

      const expenseTotal = movements
        .filter((m) => m.type === "EXPENSE")
        .reduce((sum, m) => sum + m.amount, 0);

      const balance = incomeTotal - expenseTotal;

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
      checkRole(user, "ADMIN");
      console.log(date);
      return prisma.movement.create({
        data: { concept, amount, date: date, type, userId: user.id },
        include: { user: true },
      });
    },
    async updateMovement(
      _,
      { id, concept, amount, date, type },
      { prisma, user }
    ) {
      checkRole(user, "ADMIN");
      const movement = await prisma.movement.findUnique({
        where: { id: Number(id) },
      });
      console.log({ id, concept, amount, date, type });
      const data = await prisma.movement.update({
        where: { id: Number(id) },
        data: {
          concept,
          amount,
          date: date ? new Date(date) : undefined,
          type,
        },
      });
      console.log(data);
      return data;
    },
    async deleteMovement(_, { id }, { prisma, user }) {
      checkRole(user, "ADMIN");
      console.log({ id });
      const movement = await prisma.movement.findUnique({
        where: { id: Number(id) },
      });
      if (movement) {
        await prisma.movement.delete({ where: { id: Number(id) } });
        return true;
      }

      return false;
    },
    async updateUser(_, { id, name, role, phone, image }, { prisma, user }) {
      checkRole(user, "ADMIN");
      return prisma.user.update({
        where: { id },
        data: { name, role, phone, image },
        include: { movements: true },
      });
    },
  },
};
