import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IUserSession } from "../../types/session-user";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "@/gql/query/users";
import { useEffect, useReducer } from "react";
interface IUserDialog {
  title: string;
  user: {
    name: string;
  };
}
const initialState = {
  name: "",
  email: "",
  password:"",
  rpass:"",
  role: "USER",
};

const reducer = (
  state: typeof initialState,
  action: { type: string; payload: string }
) => {
  switch (action.type ) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    
    default:
      return state;
  }
};
export function UserDialog({ title, user }: IUserDialog) {
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log({state})
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title} {user?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue={state.name} className="col-span-3" placeholder="Zoe" 
            onChange={(e)=>dispatch({type:"SET_NAME",payload: e.target.value})}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Rol
            </Label>
            <Input id="username" defaultValue={state.role} className="col-span-3"
            onChange={(e)=>dispatch({type:"SET_ROL",payload: e.target.value})}/>
            
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Email
            </Label>
            <Input id="username" defaultValue={state.email} type="email" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Password
            </Label>
            <Input id="username" defaultValue={state.password} className="col-span-3"
            type="password" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              repeat Password
            </Label>
            <Input id="username" defaultValue={state.rpass} type="password" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
