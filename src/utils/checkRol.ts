import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client/extension";
export const checkRole = (
  user:{role:string} | undefined,
  requiredRole: string
) => {
  if (user?.role !== requiredRole) {
    throw new Error("Unauthorized");
  }
  if (!user){
    throw new Error("No Authenticated");
  }
  
};
