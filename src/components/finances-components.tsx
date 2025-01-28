"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@apollo/client";
import { GET_MOVEMENTS } from "@/gql/query/Movements";
import { useSession } from "next-auth/react";

export function FinancesComponents() {
  const { data, loading, error, refetch } = useQuery(GET_MOVEMENTS);
  const { data: session } = useSession()
  console.log(session)

  const [newTransaction, setNewTransaction] = useState({
    type: "INCOME",
    total: 0,
    concept: "",
    amount: "",
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  useEffect(() => {
    if (data?.getMovements) {
      const totalIncome = data?.getMovements
        .filter((transaction) => transaction.type === "INCOME")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      const totalExpense = data.getMovements
        .filter((transaction) => transaction.type === "EXPENSE")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      setNewTransaction((prev) => ({
        ...prev,
        total: totalIncome - totalExpense,
      }));
    }
  }, [data?.getMovements]);
  console.log(newTransaction);
  return (
    <div className="flex w-full h-full justify-center items-start p-10">
      <div className="space-y-8 ">
        <h1 className="text-3xl font-bold">Manage Finances</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                defaultValue={newTransaction.type}
                onValueChange={(value) =>
                  setNewTransaction((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="concept">Description</Label>
              <Input
                id="concept"
                defaultValue={newTransaction.concept}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    concept: e.target.value,
                  }))
                }
                required
                placeholder="Home"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                defaultValue={newTransaction.concept}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    concept: e.target.value,
                  }))
                }
                required
                placeholder="123"
              />
            </div>
          </div>
          <Button type="submit">Add Transaction</Button>
        </form>
        <div className="min-h-[400px] overflow-y-auto">
          <Table className="h-full ">
            <TableHeader>
              <TableRow>
                <TableHead>Concept</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {data &&
                data?.getMovements.map((transaction) => {
                  const date = new Date(Number(transaction.createdAt));
                  const formattedDate = date.toLocaleDateString();
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.concept}</TableCell>
                      <TableCell>${transaction.amount}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>{transaction.user.name}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Your session has expired. Please log in again.
            </AlertDescription>
          </Alert>
        )}

        <h1>TOTAL:{!loading ? newTransaction.total : <>Loading...</>}</h1>
      </div>
    </div>
  );
}
