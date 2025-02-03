import { createContext } from "@/pages/api/graphql";

// types/resolvers.ts
type ResolverFn<Args = any, Return = any> = (
  parent: any,
  args: Args,
  context: typeof createContext,
  info: any
) => Return | Promise<Return>;

export interface ResolverMap {
  [key: string]: {
    [key: string]: ResolverFn;
  };
}