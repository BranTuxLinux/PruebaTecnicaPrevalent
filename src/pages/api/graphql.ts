import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { gql } from "graphql-tag";

const typeDefs = gql`
type Query {
  hello: String
}
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
});

export default startServerAndCreateNextHandler(server);
