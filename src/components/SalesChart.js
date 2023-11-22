import React from "react";
import { useSelector } from "react-redux";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer,
} from "recharts";

function summarizeSales(bookings) {
  const salesByDate = {};

  bookings.forEach((booking) => {
    const dateStr = new Date(booking.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    salesByDate[dateStr] = (salesByDate[dateStr] || 0) + booking.totalPrice;
  });

  const sortedDates = Object.keys(salesByDate).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  let target = 1000; // Initial target
  const targetIncrement = 1000; // Increment for each subsequent day

  return sortedDates.map((date) => {
    const entry = { date, sales: salesByDate[date] };
    return entry;
  });
}

// Example usage

const SalesAreaChart = ({ bookings }) => {
  const data = summarizeSales(bookings);
  const isDarkMode = useSelector((state) => state.appSettings.isDarkMode);
  const axisColor = isDarkMode ? "#FFFFFF" : "#666666";
  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={axisColor} />
        <XAxis dataKey="date" stroke={axisColor} />
        <YAxis stroke={axisColor} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDarkMode ? "#374151" : "#fff",
            color: isDarkMode && "#fff",
          }}
        />
        <Area
          type="monotone"
          dataKey="sales"
          fill={isDarkMode ? "#fff" : "#8884d8"}
          stroke="#8884d8"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesAreaChart;
