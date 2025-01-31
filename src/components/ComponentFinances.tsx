"use client";

import { useState } from "react";
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
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_MOVEMENTS, GET_MOVEMENTS } from "@/gql/query/Movements";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransactionsTable } from "@/components/TransactionsTable";
import { Calendar } from "@/components/ui/calendar"; // Importa el Calendar
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Importa Popover
import { format } from "date-fns"; // Para formatear la fecha
import { formatterCoin } from "@/utils/formaterCoin";

export function FinancesComponents() {
  const { data, loading, error, refetch } = useQuery(GET_MOVEMENTS);
  const [createMovements, { loading: loadingMutation }] =
    useMutation(CREATE_MOVEMENTS);
  const { data: session } = useSession();
  const { toast } = useToast();

  const [newTransaction, setNewTransaction] = useState({
    type: "INCOME",
    total: 0,
    concept: "",
    amount: "",
    date: new Date(),
  });
  console.log({ newTransaction });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMovements({
        variables: {
          concept: newTransaction.concept,
          amount: Number(newTransaction.amount),
          date: newTransaction.date,
          type: newTransaction.type,
        },
      });
      toast({
        title: "Transaction Created",
        description: `Transaction of type ${newTransaction.type} added successfully.`,
      });

      refetch();

      setNewTransaction((prev) => ({
        ...prev,
        total: 0,
        concept: "",
        amount: "",
        date: new Date(),
      })); // Restablece la fecha
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create transaction.",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  const calculateTotals = (transactions: any[]) => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpense = transactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return totalIncome - totalExpense;
  };

  const total = data?.getMovements ? calculateTotals(data.getMovements) : 0;

  return (
    <div className="flex w-full h-full justify-center items-start p-10">
      <div className="space-y-8 ">
        <h1 className="text-3xl font-bold">Manage Finances</h1>
        {session?.user.role === "ADMIN" && (
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
                  value={newTransaction.concept}
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
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  required
                  placeholder="123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {newTransaction?.date
                        ? format(newTransaction?.date, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTransaction?.date}
                      onSelect={(date) => {
                        setNewTransaction((prev) => ({
                          ...prev,
                          date: new Date(date || new Date()),
                        }));
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("2000-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button type="submit" disabled={loadingMutation}>
              {loadingMutation ? "Adding..." : "Add Transaction"}
            </Button>
          </form>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <div className="min-h-[400px] overflow-y-auto">
          <TransactionsTable
            transactions={data?.getMovements || []}
            loading={loading}
            refetch={refetch}
          />
        </div>

        <h1>
          TOTAL: {loading ? "Loading..." : `${formatterCoin.format(total)}`}
        </h1>
      </div>
    </div>
  );
}
