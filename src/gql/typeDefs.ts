import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID
    name: String
    email: String
    phone: String
    role: Role
    image: String
    movements: [Movement!]!
  }
  enum Role {
    ADMIN
    USER
  }

  type Movement {
    id: ID!
    concept: String!
    amount: Float!
    date: String!
    type: MovementType!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  enum MovementType {
    INCOME
    EXPENSE
  }

  type Query {
    getUsers: [User]! # Solo para administradores
    getUserById(id: ID!): User # Solo para administradores
    getMovements: [Movement]! # Todos los roles
    getMovementById(id: ID!): Movement # Todos los roles
  }

  type Mutation {
    createMovement(
      concept: String!
      amount: Float!
      date: String!
      type: MovementType!
    ): Movement! # Admin
    updateMovement(
      id: ID!
      concept: String
      amount: Float
      date: String
      type: MovementType
    ): Movement! # Admin
    deleteMovement(id: ID!): Boolean! # Admin
    createUser(name: String!, email: String!, password: String!): User # Admin
    updateUser(
      id: ID!
      name: String
      role: Role
      phone: String
      image: String
    ): User! # Admin
    deleteUser(id: ID!): Boolean! # Admin
  }
  type Report {
    incomeTotal: Float!
    expenseTotal: Float!
    balance: Float!
    movements: [Movement!]!
  }

  type Query {
    getReport(startDate: String!, endDate: String!, userId: ID): Report!
  }
`;