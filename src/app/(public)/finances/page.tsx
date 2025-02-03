import { FinancesComponents } from "@/components/ComponentFinances";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Finances",
    description: "Financial Management System",
    icons: "/file.svg",
  };
  
export default function Finances() {
    return <FinancesComponents />
}