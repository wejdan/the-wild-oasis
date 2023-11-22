import React from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#FF8042", "#00C49F", "#FFBB28", "#0088FE"];

function summarizeBookings(bookings) {
  const summary = {
    "2 nights": 0,
    "3 nights": 0,
    "4-5 nights": 0,
    "8-14 nights": 0,
  };
  console.log("bookings", bookings);
  bookings.forEach((booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const nights = (endDate - startDate) / (1000 * 3600 * 24);

    if (nights === 2) {
      summary["2 nights"]++;
    } else if (nights === 3) {
      summary["3 nights"]++;
    } else if (nights >= 4 && nights <= 5) {
      summary["4-5 nights"]++;
    } else if (nights >= 8 && nights <= 14) {
      summary["8-14 nights"]++;
    }
  });

  return Object.entries(summary).map(([name, value]) => ({ name, value }));
}
const DonutChartComponent = ({ bookings }) => {
  const data = summarizeBookings(bookings);
  const isDarkMode = useSelector((state) => state.appSettings.isDarkMode);

  return (
    <ResponsiveContainer width={450} height={300}>
      <PieChart>
        <Pie
          data={data}
          cx={150}
          cy={150}
          innerRadius={70} // Inner radius to create a donut look
          outerRadius={100} // Outer radius of the pie
          fill="#8884d8"
          paddingAngle={5} // Angle between slices
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              strokeWidth={0}
            />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChartComponent;
