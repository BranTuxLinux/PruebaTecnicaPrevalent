import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useMutation } from "@apollo/client";
import { UPDATE_MOVEMENTS } from "@/gql/query/Movements";
import { IModalFinances } from "./components";

export const ModalFinances: React.FC<IModalFinances> = ({
  title,
  transaction,
  refetch,
}) => {
  const { toast } = useToast();

  const [editTransaction, setEditTransaction] = useState({
    concept: transaction?.concept || "",
    amount: transaction?.amount || 0,
    date: transaction?.date ? new Date(Number(transaction.date)) : new Date(),
  });
  console.log(editTransaction.date);
  const [updateTransaction] = useMutation(UPDATE_MOVEMENTS, {
    onCompleted: () => {
      refetch();
      toast({
        title: "Éxito",
        description: "Transacción actualizada correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Error al actualizar: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction?.id) return;

    updateTransaction({
      variables: {
        updateMovementId: Number(transaction.id),
        date: editTransaction.date,
        concept: editTransaction.concept,
        amount: editTransaction.amount,
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title} Transaction</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Campo Monto */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                className="col-span-3"
                defaultValue={editTransaction.amount}
                onChange={(e) =>
                  setEditTransaction((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            {/* Campo Concepto */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="concept" className="text-right">
                Concept
              </Label>
              <Input
                id="concept"
                className="col-span-3"
                value={editTransaction.concept}
                onChange={(e) =>
                  setEditTransaction((prev) => ({
                    ...prev,
                    concept: e.target.value,
                  }))
                }
              />
            </div>

            {/* Selector de Fecha */}
            <div className="grid grid-cols-4 items-center gap-4 w-full">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal col-span-3 "
                  >
                    {format(editTransaction.date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editTransaction.date}
                    onSelect={(date) => {
                      if (date) {
                        setEditTransaction((prev) => ({
                          ...prev,
                          date: date,
                        }));
                      }
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2000-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
