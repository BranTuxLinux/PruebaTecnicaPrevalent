import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import SignOut from "./sign-out";
import { Button } from "./ui/button";

export const AvatarMenu = ({
  children,
  user,
}: {
  children: ReactNode;
  user: { role: string };
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user?.role}</DropdownMenuLabel>
        <hr />
        <DropdownMenuItem className="flex justify-center items-center">
          <Button asChild>
            <SignOut />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
