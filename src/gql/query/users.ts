import gql from "graphql-tag";

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      email
      id
      image
      name
      role
      phone
    }
  }
`;
export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      email
      id
      name
      phone
      role
      image
    }
  }
`;
