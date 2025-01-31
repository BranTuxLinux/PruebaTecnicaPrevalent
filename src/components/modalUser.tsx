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
import { ApolloQueryResult, useMutation } from "@apollo/client";
import { UPDATE_MOVEMENTS } from "@/gql/query/Movements";
import { UPDATE_USER } from "@/gql/query/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
interface IFinances {
  title: string;
  user?: {} | any;
  refetch: () => Promise<ApolloQueryResult<any>>;
}
export const ModalUser: React.FC<IFinances> = ({
  title,
  user: us,
  refetch,
}) => {
  const { toast } = useToast();
  const [user, setUser] = useState({
    name: us.name,
    phone: us.phone,
    role: us.role,
  });
  const [openDialog, setOpenDialog] = useState(false)
  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      refetch();
      setOpenDialog(false)
      toast({
        title: "Éxito",
        description: "Transacción actualizada correctamente",
      });
    },
    onError: (error) => {
      setOpenDialog(false)
      toast({
        title: "Error",
        description: `Error al actualizar: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
console.log(user)
    if (!us?.id) return;

    updateUser({
      variables: {
        id: us.id,
        role: user.role,
        phone: user.phone,
        name: user.name,
      },
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild >
        <Button variant="outline">{title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title} Transaction</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                defaultValue={user.name}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Phone" className="text-right">
                Phone
              </Label>
              <Input
                id="Phone"
                type="tel"
                className="col-span-3"
                defaultValue={user.phone}
                placeholder={!us.phone ? "Not registered yet" : us.phone}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Role" className="text-right">
                role
              </Label>
              <Select
                defaultValue={user.role}
                onValueChange={(value) =>
                  setUser((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger id="Role" className="col-span-3">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Loading...":"Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
