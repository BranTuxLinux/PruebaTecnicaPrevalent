export const calculateTotals = (transactions: any[]) => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpense = transactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return totalIncome - totalExpense;
  };