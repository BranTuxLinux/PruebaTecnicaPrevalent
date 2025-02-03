export const checkRole = (
  user: { role: string } | undefined,
  requiredRole: string
) => {
  if (!user) {
    throw new Error("No Authenticated");
  }
  if (user?.role !== requiredRole) {
    throw new Error("Unauthorized");
  }
};
