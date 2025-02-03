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
import { HandleDatesReports } from "./tools/HandleDatesReports";
import Loading from "./tools/loading";
import { unparse } from "papaparse";
import { FormattedEntry, Movement } from "./components";
import { handleDownloadCSV } from "@/utils/DownloadCSV";

type ChartDataType = FormattedEntry[];

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
  const formattedData = data?.getReport?.movements?.reduce(
    (acc: Record<string, FormattedEntry>, movement: Movement) => {
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
    },
    {}
  );

  const chartData: any = Object.values(formattedData || {})
  .sort((a: any, b: any): number => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    if (isNaN(dateA) || isNaN(dateB)) {
      throw new Error("Invalid date format in formattedData");
    }
    
    return dateA - dateB;
  });

  
  const Total =
    chartData.length > 0
      ? (chartData[chartData.length - 1] as { balance: number }).balance
      : 0;

  return (
    <div className="w-4/5 h-4/5">
      <div className="p-10 flex  justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <HandleDatesReports
          date={date}
          setDate={setDate}
          handleRecharge={handleRecharge}
        />
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
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                border: "none",
                opacity: 0.7,
              }}
            />
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

      <div className="flex justify-around items-center">
        <Button onClick={() => handleDownloadCSV(chartData)}>Download CSV Report</Button>
        <span className="flex items-center">
          Balance:
          <p
            className={`text-2xl ${
              Total < 0 ? "text-red-900" : "text-green-800"
            }`}
          >
            ${Total}
          </p>
        </span>
      </div>
    </div>
  );
}
