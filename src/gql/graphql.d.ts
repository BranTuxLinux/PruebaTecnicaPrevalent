export interface IGraphQLContext {
  prisma: PrismaClient;
  user: Session["user"] | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone:string
}

export interface GetUsersResponse {
  getUsers: User[];
}
