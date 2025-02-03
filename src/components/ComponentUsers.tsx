"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "@/gql/query/users";
import { GetUsersResponse } from "@/gql/graphql";
import { Loader2 } from "lucide-react";

import { ModalUser } from "./ModalUser";

export const User = () => {
  const { data, error, loading, refetch } =
    useQuery<GetUsersResponse>(GET_USERS);
  console.table({ data, error, loading });

  return (
    <section className="w-full h-[80%] m-20 ">
      <h1 className="text-3xl font-bold p-10">Manage Users</h1>
      <div className="w-full h-full overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="max-h-1">
            {loading && (
              <TableRow>
                <TableCell>
                  <Loader2 className="animate-spin" />
                </TableCell>
              </TableRow>
            )}

            {data?.getUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <ModalUser refetch={refetch} title="Edit" user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
