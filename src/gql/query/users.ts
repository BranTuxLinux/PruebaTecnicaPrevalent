import gql from "graphql-tag";

export const GET_USERS = gql`
  query Query {
    getUsers {
      name
      image
      email
    }
  }
`;
