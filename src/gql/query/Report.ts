import gql from "graphql-tag";

export const GET_REPORT = gql`
  query GetReport($startDate: String!, $endDate: String!) {
    getReport(startDate: $startDate, endDate: $endDate) {
      movements {
        amount
        concept
        createdAt
        date
        id
        type
        updatedAt
        user {
          name
          phone
          role
          email
          id
        }
      }
      incomeTotal
      expenseTotal
      balance
    }
  }
`;
