export interface Transaction {
  id: string;
  concept: string;
  amount: number;
  type: string;
  date: string;
  user: {
    name: string;
  };
}

export interface TransactionsTableProps {
  transactions: Transaction[];
  loading: boolean;
  refetch: () => Promise<ApolloQueryResult<any>>;
}
export interface IFinances {
  title: string;
  user?: {} | any;
  refetch: () => Promise<ApolloQueryResult<any>>;
}

export interface IModalFinances {
  title: string;
  transaction?: {} | any;
  refetch: () => Promise<ApolloQueryResult<any>>;
}

export interface Movement {
  date: string; 
  type: "INCOME" | "EXPENSE";
  amount: number;
}

export interface FormattedEntry {
  date: string;
  income: number;
  expense: number;
  balance: number;
}
export type FormattedDataType = Record<string, FormattedEntry> | undefined;
