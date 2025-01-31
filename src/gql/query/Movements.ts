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

export const CREATE_MOVEMENTS = gql`
  mutation CreateMovement(
    $concept: String!
    $amount: Float!
    $date: String!
    $type: MovementType!
  ) {
    createMovement(
      concept: $concept
      amount: $amount
      date: $date
      type: $type
    ) {
      concept
      amount
      date
      type
    }
  }
`;
export const UPDATE_MOVEMENTS = gql`
  mutation UpdateMovement(
    $updateMovementId: ID!
    $concept: String
    $amount: Float
    $date: String
    $type: MovementType
  ) {
    updateMovement(
      id: $updateMovementId
      concept: $concept
      amount: $amount
      date: $date
      type: $type
    ) {
      amount
      concept
      createdAt
      date
      updatedAt
      id
      type
    }
  }
`;
export const DELETE_MOVEMENTS = gql`
  mutation DeleteMovement($deleteMovementId: ID!) {
    deleteMovement(id: $deleteMovementId)
  }
`;
