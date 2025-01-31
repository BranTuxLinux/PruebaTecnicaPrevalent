"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { ApolloQueryResult, useMutation } from "@apollo/client";
import { DELETE_MOVEMENTS, UPDATE_MOVEMENTS } from "@/gql/query/Movements";
import { ModalFinances } from "./modalFinances";
import { useState } from "react";
import { AlertDialogFinances } from "./tools/Alert";
import { useToast } from "@/hooks/use-toast";
import { formatterCoin } from "@/utils/formaterCoin";
import { useSession } from "next-auth/react";

interface Transaction {
  id: string;
  concept: string;
  amount: number;
  type: string;
  date: string;
  user: {
    name: string;
  };
}

interface TransactionsTableProps {
  transactions: Transaction[];
  loading: boolean;
  refetch: () => Promise<ApolloQueryResult<any>>;
}

export function TransactionsTable({
  transactions,
  loading,
  refetch,
}: TransactionsTableProps) {
  const { toast } = useToast();

  const { data: session } = useSession();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );
  const isAdmin = session?.user.role === "ADMIN";
  const openDeleteDialog = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };
  const [deleteTransaction] = useMutation(DELETE_MOVEMENTS, {
    onCompleted: (data) => {
      if (!data.deleteMovement)
        toast({
          title: "Error",
          description: "Failed to delete the transaction. Please try again.",
          variant: "destructive",
        });

      refetch();
      toast({
        title: "Success",
        description: "Transaction deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to delete the transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleDelete = (id: string) => {
    if (transactionToDelete) {
      deleteTransaction({
        variables: { deleteMovementId: transactionToDelete },
      });
      closeDeleteDialog();
    }
  };

  return (
    <>
      <div
        style={{ scrollbarWidth: "none" }}
        className="max-h-[400px] overflow-auto relative"
      >
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead>Concept</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              {isAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
            {transactions.map((transaction) => {
              const date = new Date(Number(transaction.date));
              const formattedDate = date.toLocaleDateString();
              return (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.concept}</TableCell>
                  <TableCell>
                    {formatterCoin.format(transaction.amount)}
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>{transaction.user.name}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <ModalFinances title={"Edit"} transaction={transaction} refetch={refetch} />
                      <Button onClick={() => openDeleteDialog(transaction.id)} variant={"destructive"}>
                        delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <AlertDialogFinances
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        confirmed={handleDelete}
        close={closeDeleteDialog}
      />
    </>
  );
}
