import ComponentReports from "@/components/ComponentsReports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description: "Financial Management System",
  icons: "/file.svg",
};

export default function Reports() {
  return <ComponentReports />
}