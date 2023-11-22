import React, { useState } from "react";
import BookingSummary from "./BookingSummary";
import { useCustomQuery } from "../hooks/queryHook";
import {
  filterBookingsData,
  getAllBookings,
  getBookingsWithDetails,
} from "../store/actions/bookingActions";
import Loader from "./Loader";
import Spinner from "./Spinner";

function TodayActivities() {
  const [updteingId, setUpdatingId] = useState(null);

  const bookingQuery = useCustomQuery("today-activities", getAllBookings, [], {
    onSuccess: (data) => {
      // This is your onSuccess callback
      setUpdatingId(null);
    },
  });
  const bookingsList = bookingQuery.isEmpty ? [] : bookingQuery.data;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayActivities = bookingsList.filter((booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    // Set hours to midnight for accurate comparison
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    return (
      (startDate.getTime() === today.getTime() &&
        booking.status === "Unconfirmed") ||
      (endDate.getTime() === today.getTime() && booking.status === "Checked in")
    );
  });
  console.log("todayActivities", todayActivities);
  return (
    <div className=" bg-white dark:bg-gray-800  px-8 py-7  rounded-md relative ">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Today</h2>
      <div className="max-h-80 overflow-y-auto  hide-scrollbar">
        {bookingQuery.isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center hide-scrollbar">
            <Spinner size={"20px"} />
          </div>
        ) : todayActivities.length > 0 ? (
          todayActivities.map((item) => {
            return (
              <BookingSummary
                updteingId={updteingId}
                setUpdatingId={setUpdatingId}
                key={item.id}
                bookingData={item}
              />
            );
          })
        ) : (
          <p className="dark:text-white mt-6 text-center">
            No activity today...
          </p>
        )}
      </div>

      {/* ... Repeat for other events */}
    </div>
  );
}

export default TodayActivities;
