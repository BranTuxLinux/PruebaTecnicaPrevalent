import { User } from "@/components/ComponentUsers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Financial Management System",
  icons: "/file.svg",
};

export default async function Users() {
  return <User />;
}
