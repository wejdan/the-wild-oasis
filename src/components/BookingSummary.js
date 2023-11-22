import React from "react";
import { useSelector } from "react-redux";
import { daysBetweenDates } from "../utils";
import Button from "./Button";
import Tag from "./Tag";
import { getGuests } from "../store/actions/guestsActions";
import { useCustomQuery } from "../hooks/queryHook";
import Spinner from "./Spinner";
import {
  getAllBookings,
  updateBookingStatus,
} from "../store/actions/bookingActions";
import useDataMutation from "../hooks/useDataMutation";
import { toast } from "react-hot-toast";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

function BookingSummary({ bookingData, updteingId, setUpdatingId }) {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const filterStatus = searchParams.get("days") || "Last 7 days";
  const guestsQuery = useCustomQuery("guests", getGuests);
  const guestsList = guestsQuery.isEmpty ? [] : guestsQuery.data;

  const guest = guestsList.find((g) => g.id === bookingData.guestId);
  const isIn = bookingData.status === "Unconfirmed";
  const isOut = bookingData.status === "Checked in";
  const isLeft = bookingData.status === "Checked out";

  const checkStatusMutation = useDataMutation(
    updateBookingStatus,
    ["today-activities", bookingData.id],
    () => {
      toast.success("booking was updated successfuly ");
    },
    (err) => {
      toast.error(err.message);
    }
  );

  return (
    <div className="grid grid-cols-[1fr,2fr,1fr,1fr] gap-2 border-t-1 border-t-gray-100 dark:border-t-gray-700 py-2  mb-2 items-center">
      <Tag
        text={isOut ? "departing" : isLeft ? "Left" : "Arriving"}
        color={isOut ? "blue" : "green"}
        small={true}
      />
      {guestsQuery.isPending ? (
        <Spinner size={"20px"} />
      ) : (
        <div className="flex items-center text-left">
          <img
            src={guest.countryFlag}
            alt="flag"
            className="w-4 h-3 ml-2 mr-2"
          />

          <span className=" text-sm font-bold text-gray-600 dark:text-gray-200">
            {guest.fullName}
          </span>
        </div>
      )}
      <span className="text-left dark:text-gray-200">{` ${daysBetweenDates(
        bookingData.startDate,
        bookingData.endDate
      )} nights`}</span>
      {isOut && (
        <Button
          loading={
            checkStatusMutation.isPending || bookingData.id === updteingId
          }
          onClick={() => {
            setUpdatingId(bookingData.id);
            checkStatusMutation.mutate({
              id: bookingData.id,
              status: "Checked out",
            });
          }}
          small={true}
        >
          Check out
        </Button>
      )}
      {isIn && (
        <Button
          small={true}
          loading={
            checkStatusMutation.isPending || bookingData.id === updteingId
          }
          onClick={() => {
            setUpdatingId(bookingData.id);
            checkStatusMutation.mutate({
              id: bookingData.id,
              status: "Checked in",
            });
          }}
        >
          Check in
        </Button>
      )}
    </div>
  );
}

export default BookingSummary;
