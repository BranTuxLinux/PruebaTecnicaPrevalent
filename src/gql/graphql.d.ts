
export interface IGraphQLContext {
    prisma: PrismaClient;
    user: Session["user"] | null;
  }
  