import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  checkIn,
  deleteBooking,
  getBookingData,
  updateBookingStatus,
} from "../store/actions/bookingActions";
import Loader from "../components/Loader";
import Tag from "../components/Tag";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { daysBetweenDates, formatDate } from "../utils";
import { useSelector } from "react-redux";
import { AiOutlineCheckCircle, AiOutlineDollarCircle } from "react-icons/ai";
import { useCustomQuery } from "../hooks/queryHook";
import { getGuests } from "../store/actions/guestsActions";
import { getCabins } from "../store/actions/cabinsActions";
import { useQuery } from "@tanstack/react-query";
import Button from "../components/Button";
import useDataMutation from "../hooks/useDataMutation";
import { toast } from "react-hot-toast";
import { readSettings } from "../store/actions/settingsActions";
import ConfirmationMessage from "../components/ConfirmationMessage";
import Modal, { useModalWindow } from "../components/ModalV2";
import PageTitle from "../components/PageTitle";
function BookingDetails() {
  const { id } = useParams();
  const [paid, isPaid] = useState(false);
  const isDarkMode = useSelector((state) => state.appSettings.isDarkMode);

  const [hasBreakfast, setHasBreakfast] = useState(false);

  const navigate = useNavigate();
  const guestsQuery = useCustomQuery("guests", getGuests);
  const guestsList = guestsQuery.isEmpty ? [] : guestsQuery.data;

  const cabinsQuery = useCustomQuery("cabins", getCabins);
  const cabinsList = cabinsQuery.isEmpty ? [] : cabinsQuery.data;

  const settingsQuery = useCustomQuery("settings", readSettings);
  const settings = settingsQuery.isEmpty ? [] : settingsQuery.data;
  const { onClose, modalData } = useModalWindow();

  const queryResult = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingData(id),
  });
  const bookingData = queryResult.data ? queryResult.data : [];
  const cabin = bookingData
    ? cabinsList.find((g) => g.id === bookingData.cabinId)
    : null;
  const guest = bookingData
    ? guestsList.find((g) => g.id === bookingData.guestId)
    : null;
  const checkStatusMutation = useDataMutation(
    updateBookingStatus,
    ["booking", id],
    () => {
      toast.success("booking was updated successfuly ");
    },
    (err) => {
      toast.error(err.message);
    }
  );
  const checkInMutation = useDataMutation(
    checkIn,
    ["booking", id],
    () => {
      toast.success("booking was checked in successfuly ");
    },
    (err) => {
      toast.error(err.message);
    }
  );
  const deleteBookingMutation = useDataMutation(
    deleteBooking,
    ["bookings"],
    () => {
      onClose();
      navigate(-1);
      toast.success("booking was deleted");
    },
    (err) => {
      onClose();
      toast.error(err.message);
    }
  );
  useEffect(() => {
    isPaid(bookingData?.isPaid);
    setHasBreakfast(bookingData?.hasBreakfast);
  }, [bookingData]);
  const handleIsPaidChange = (e) => {
    isPaid(e.target.checked);
  };
  const handleHasBreakfastChange = (e) => {
    setHasBreakfast(e.target.checked);
    isPaid(false);
  };

  const nights = bookingData
    ? daysBetweenDates(bookingData.startDate, bookingData.endDate)
    : 0;
  let breakfastPrice =
    settings && bookingData
      ? settings.breakfastPrice * nights * bookingData.numGuests
      : 0;

  let totalPrice = bookingData
    ? hasBreakfast
      ? breakfastPrice + bookingData.totalPrice
      : bookingData.totalPrice
    : 0;

  totalPrice = Math.round(totalPrice * 100) / 100;
  const deleteButton = (
    <Modal.Open opens={"delete-confirm"} data={id}>
      <Button warning={true} loading={deleteBookingMutation.isPending}>
        Delete
      </Button>
    </Modal.Open>
  );
  return (
    <div>
      {!queryResult.isFetching && !queryResult.data ? (
        <div className=" flex gap-2 items-center">
          <PageTitle>No Booking found with the id #{id}</PageTitle>

          <span
            onClick={() => navigate("/bookings")}
            className=" ml-auto font-bold text-primary cursor-pointer"
          >
            &#x2190; Back
          </span>
        </div>
      ) : (
        <>
          {" "}
          <div className=" flex gap-2 items-center">
            <PageTitle>Booking #{id}</PageTitle>
            {bookingData && (
              <Tag
                textColor={"#205674"}
                color={"#d9f1fb"}
                text={bookingData.status}
              />
            )}
            <span
              onClick={() => navigate(-1)}
              className=" ml-auto font-bold text-primary cursor-pointer"
            >
              &#x2190; Back
            </span>
          </div>
          <div className="w-full space-y-8 bg-white dark:bg-gray-800  rounded-lg overflow-hidden ">
            {queryResult.isFetching ? (
              <Loader />
            ) : (
              <div>
                <div className=" bg-primary dark:bg-primary-light  px-16 py-5 text-white dark:text-primary-dark  flex items-center justify-between">
                  <div className=" flex items-center">
                    <HiOutlineHomeModern className="mr-5" size={"30px"} />
                    <span>
                      {` ${nights}
                   nights in cabin ${cabin.name}`}
                    </span>
                  </div>
                  <span>
                    {`${formatDate(bookingData.startDate)} - ${formatDate(
                      bookingData.endDate
                    )}`}
                  </span>
                </div>
                <div className=" px-16 py-5 bg-white dark:bg-gray-800 ">
                  <div className="flex items-center space-x-4 mb-7">
                    <img
                      src={guest.countryFlag}
                      alt="flag"
                      className="w-6 h-4"
                    />

                    <div className="flex items-center space-x-2 dark:text-white">
                      <span className="font-bold ">{guest.fullName}</span>
                      <span>+{bookingData.numGuests} guests</span>
                    </div>

                    <span className="text-xl">&middot;</span>

                    <span className="text-blue-500 dark:text-blue-100">
                      {guest.email}
                    </span>

                    <span className="text-xl">&middot;</span>

                    <span className="dark:text-blue-100">
                      National ID ${guest.nationalID}
                    </span>
                  </div>
                  <div className="mb-7 flex items-center text-sm font-semibold text-gray-800 dark:text-blue-100">
                    <AiOutlineCheckCircle size={"20px"} className=" mr-2" />
                    <span>
                      Breakfast included?{" "}
                      <span className=" ml-2">
                        {bookingData.hasBreakfast ? "Yes" : "No"}
                      </span>
                    </span>{" "}
                    {/* Replace with the actual icon */}
                  </div>

                  <div
                    style={{
                      backgroundColor: isDarkMode ? "#e5e7eb" : "#fdf8b9",
                    }}
                    className=" px-4 py-2 rounded shadow-sm"
                  >
                    <div
                      style={{ color: isDarkMode ? "#1e3a8a" : "#775a17" }}
                      className="flex justify-between items-center mb-2 "
                    >
                      <div className="flex items-center space-x-4">
                        <AiOutlineDollarCircle size={"20px"} className="" />

                        <span className="font-bold">Total price</span>
                        <span className=" font-semibold">
                          ${bookingData.totalPrice} (${cabin.regularPrice} cabin{" "}
                          {bookingData.hasBreakfast && "+$450.00 breakfast"})
                        </span>
                      </div>
                      <div className=" font-semibold p-2 rounded">
                        WILL PAY AT PROPERTY
                      </div>
                    </div>
                  </div>

                  <div className=" text-xs text-gray-500 mt-8 text-right dark:text-blue-100">
                    Booked {` ${formatDate(bookingData.created_at)}`}
                  </div>
                </div>
              </div>
            )}
          </div>
          {bookingData.status === "Unconfirmed" && !queryResult.isFetching && (
            <div className="mt-5 ">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={hasBreakfast}
                  onChange={handleHasBreakfastChange}
                  className="form-checkbox"
                />
                <span>Want additional breakfast for ${breakfastPrice}</span>
              </label>
              <div className="mt-6 flex justify-between space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={paid}
                    disabled={paid}
                    onChange={handleIsPaidChange}
                    className="form-checkbox"
                  />
                  <span>
                    I confirm {guest.fullName} has paid ${totalPrice}
                  </span>
                </label>

                <div className="flex space-x-1">
                  <Button
                    disabled={!paid}
                    loading={checkInMutation.isPending}
                    onClick={() => {
                      checkInMutation.mutate({
                        id,

                        hasBreakfast,
                        totalPrice: totalPrice,
                      });
                    }}
                  >
                    Check in
                  </Button>
                  {deleteButton}
                </div>
              </div>
            </div>
          )}
          {!queryResult.isFetching && bookingData.status !== "Unconfirmed" && (
            <div className="flex justify-end space-x-6 mt-5">
              {bookingData.status === "Checked in" && (
                <Button
                  loading={checkStatusMutation.isPending}
                  onClick={() => {
                    checkStatusMutation.mutate({ id, status: "Checked out" });
                  }}
                >
                  Check out
                </Button>
              )}

              {deleteButton}
            </div>
          )}
          <Modal.Window name={"delete-confirm"} isSmall={true}>
            <ConfirmationMessage>
              <ConfirmationMessage.Content>
                Are you sure you want to delete this booking?
              </ConfirmationMessage.Content>
              <ConfirmationMessage.Actions
                handleCancel={onClose}
                isLoading={deleteBookingMutation.isPending}
                handleYes={async () => {
                  deleteBookingMutation.mutate({ id: modalData });
                }}
              />
            </ConfirmationMessage>
          </Modal.Window>
        </>
      )}
    </div>
  );
}

export default BookingDetails;
