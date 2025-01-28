"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function Reports() {
  const [data] = useState([
    { name: "Jan", income: 4000, expense: 2400 },
    { name: "Feb", income: 3000, expense: 1398 },
    { name: "Mar", income: 2000, expense: 9800 },
    { name: "Apr", income: 2780, expense: 3908 },
    { name: "May", income: 1890, expense: 4800 },
    { name: "Jun", income: 2390, expense: 3800 },
  ])

  const handleDownloadCSV = () => {
    // Implement CSV download logic here
    console.log("Downloading CSV...")
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Financial Reports</h1>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#8884d8" />
            <Bar dataKey="expense" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Button onClick={handleDownloadCSV}>Download CSV Report</Button>
    </div>
  )
}

