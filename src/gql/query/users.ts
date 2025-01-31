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
export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String
    $role: Role
    $phone: String
  ) {
    updateUser(id: $id, name: $name, role: $role, phone: $phone) {
      email
      id
      image
      movements {
        amount
        concept
        date
        type
        createdAt
        id
      }
      name
      phone
      role
    }
  }
`;
