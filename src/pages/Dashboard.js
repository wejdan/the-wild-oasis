import { useEffect, useState } from "react";
import FilterButtons from "../components/FilterButtons";
import { HiOutlineBriefcase } from "react-icons/hi2";
import Card from "../components/Card";
import { BsCashStack } from "react-icons/bs";
import { IoCalendarOutline, IoStatsChartOutline } from "react-icons/io5";
import {
  filterBookingsByDate,
  filterBookingsByStays,
} from "../store/actions/bookingActions";
import BookingSummary from "../components/BookingSummary";
import Loader from "../components/Loader";
import DonutChartComponent from "../components/DonutChartComponent";
import SalesChart from "../components/SalesChart";
import PageTitle from "../components/PageTitle";
import { useCustomQuery } from "../hooks/queryHook";
import { useSearchParams } from "react-router-dom";
import { formatPrice, getSalesDateRange } from "../utils";
import { getCabins } from "../store/actions/cabinsActions";
import TodayActivities from "../components/TodayActivities";
const filtersList = ["Last 7 days", "Last 30 days", "Last 90 days"];
function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterStatus = searchParams.get("days") || "Last 7 days";
  let days = 0;
  switch (filterStatus) {
    case "Last 7 days":
      days = 7;
      break;
    case "Last 30 days":
      days = 30;
      break;
    case "Last 90 days":
      days = 90;
      break;
    default:
      days = 7; // Default to 7 days if no match
  }
  const bookingQuery = useCustomQuery("bookingsList", filterBookingsByDate, [
    filterStatus,
  ]);
  const bookingsList = bookingQuery.isEmpty ? [] : bookingQuery.data;

  const cabinsQuery = useCustomQuery("cabins", getCabins);
  const cabinsList = cabinsQuery.isEmpty ? [] : cabinsQuery.data;

  const bookingStaysQuery = useCustomQuery(
    "bookingsStays",
    filterBookingsByStays,
    [filterStatus]
  );
  const recentStays = bookingStaysQuery.isEmpty ? [] : bookingStaysQuery.data;

  const totalPrice = bookingsList.reduce(
    (accumulator, booking) => accumulator + booking.totalPrice,
    0
  );

  let totalDays = 0;

  recentStays.forEach((booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const duration = (endDate - startDate) / (1000 * 3600 * 24); // Convert milliseconds to days
    totalDays += duration;
  });

  const rate = (totalDays / (cabinsList.length * days)) * 100;

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center">
        <PageTitle>Dashboard</PageTitle>
        <FilterButtons
          defaultValue="Last 7 days"
          filterName={"days"}
          filtersLists={filtersList}
        />
      </div>
      {(bookingQuery.isLoading ||
        bookingStaysQuery.isLoading ||
        cabinsQuery.isLoading) && <Loader blur={true} />}
      <div className="w-full space-y-8  px-16 py-7   ">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6 ">
          {/* You can create a reusable component for these stat boxes */}
          <Card
            title="Bookings"
            subTitle={bookingsList.length}
            IconComponent={HiOutlineBriefcase}
            color="blue"
          />
          <Card
            title="Sales"
            subTitle={`$${formatPrice(totalPrice)}`}
            IconComponent={BsCashStack}
            color="green"
          />

          <Card
            title="Check ins"
            subTitle={recentStays.length}
            IconComponent={IoCalendarOutline}
            color="indigo"
          />
          <Card
            title="Occupancy rate"
            subTitle={`${Math.round(rate)}%`}
            IconComponent={IoStatsChartOutline}
            color="yellow"
          />
          {/* ... Repeat for other boxes */}
        </div>

        {/* Today's Events */}
        <div className="mb-6 grid grid-cols-2 gap-4 ">
          <TodayActivities />

          <div className="bg-white dark:bg-gray-800  px-8 py-7  rounded-md">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">
              Stay duration summary
            </h2>
            <DonutChartComponent bookings={recentStays} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800  px-8 py-7  rounded-md w-full">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            {getSalesDateRange(recentStays)}
          </h2>
          <SalesChart bookings={recentStays} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
