import gql from "graphql-tag";

export const GET_MOVEMENTS = gql`
  query GetMovements {
    getMovements {
      id
      concept
      amount
      date
      type
      user {
        name
        email
        id
        role
      }
      createdAt
      updatedAt
    }
  }
`;
