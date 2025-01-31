"use client";

import { useQuery } from "@apollo/client";
import { format, subDays } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { GET_REPORT } from "@/gql/query/Report";
import { useState } from "react";
import { HandleDatesReports } from "./HandleDatesReports";
import Loading from "./tools/loading";

export default function ComponentReports() {
  const [date, setDate] = useState({
    startDate: subDays(new Date(), 10).toISOString(),
    endDate: new Date().toISOString(),
  });
  const { data, loading, error, refetch } = useQuery(GET_REPORT, {
    variables: {
      startDate: date.startDate,
      endDate: date.endDate,
    },
  });

  if (loading)
    return (
      <section className="w-full h-full">
        <Loading />
      </section>
    );
  if (error)
    return <section className="w-full h-full">{error.message}</section>;
  const handleRecharge = () => refetch();
  const formattedData = data?.getReport?.movements?.reduce((acc, movement) => {
    const date = format(new Date(Number(movement.date)), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = { date, income: 0, expense: 0, balance: 0 };
    }
    if (movement.type === "INCOME") {
      acc[date].income += movement.amount;
    } else {
      acc[date].expense += movement.amount;
    }
    acc[date].balance = acc[date].income - acc[date].expense;
    return acc;
  }, {});

  const chartData = Object.values(formattedData);

  const handleDownloadCSV = () => {
    const csvContent = [
      ["Date", "Income", "Expense", "Balance"],
      ...chartData.map(({ date, income, expense, balance }) =>
        [date, income, expense, balance].join(",")
      ),
    ]
      .map((e) => e.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "financial_report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-4/5 h-4/5">
      <div className="p-10 flex  justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <HandleDatesReports date={date} setDate={setDate} handleRecharge={handleRecharge}/>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#4CAF50"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#F44336"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#2196F3"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Button onClick={handleDownloadCSV}>Download CSV Report</Button>
    </div>
  );
}
