
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@mui/material";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Chart({ data }) {
  // Format data if not pre-formatted
  const chartData = days.map((day) => ({
    day,
    warnings: data.find((d) => d.day === day)?.count || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData}>
        <XAxis dataKey="day" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="warnings" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
}
