import React, { useEffect, useState } from "react";
import Table from "../components/Table3";
import FilterButtons from "../components/FilterButtons";
import Dropdown from "../components/Dropdown";
import { TimeElapsed, formatDate } from "../utils";
import {
  checkIn,
  deleteBooking,
  filterBookings,
  filterBookingsData,
  getAllBookings,
  getBookings,
  getNumberOfPages,
  updateBookingStatus,
} from "../store/actions/bookingActions";
import Loader from "../components/Loader";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useCustomQuery } from "../hooks/queryHook";

import { differenceInDays, parseISO } from "date-fns";
import Pagination from "../components/Pagination";
import { useQueryClient } from "@tanstack/react-query";
import Menu from "../components/ContextMenu";
import { FiCopy, FiEdit, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { BiLinkExternal, BiLogOut, BiSolidCheckCircle } from "react-icons/bi";
import { HiEye } from "react-icons/hi2";
import Modal, { useModalWindow } from "../components/ModalV2";
import ConfirmationMessage from "../components/ConfirmationMessage";
import useDataMutation from "../hooks/useDataMutation";
import { toast } from "react-hot-toast";
import Spinner from "../components/Spinner";
import PageTitle from "../components/PageTitle";
const filtersList = ["All", "Checked out", "Checked in", "Unconfirmed"];
const filterMappings = {
  All: () => true, // or just (item) => item to return all items
  "Checked out": (item) => item.status === "Checked out",
  "Checked in": (item) => item.status === "Checked in",
  Unconfirmed: (item) => item.status === "Unconfirmed",
};
const sortingOptions = [
  { label: "Sort by date (recent first)", field: "created_at", order: "desc" },
  { label: "Sort by date (earlier first)", field: "created_at", order: "asc" },
  { label: "Sort by price (high first)", field: "totalPrice", order: "desc" },
  { label: "Sort by price (low first)", field: "totalPrice", order: "asc" },
];
function Bookings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [updatingBooking, setUpdatingBooking] = useState(null);

  const { onClose, modalData } = useModalWindow();

  const queryClient = useQueryClient();
  const filterStatus = searchParams.get("status") || "All";
  const sortBy = searchParams.get("sortBy") || "created_at";
  const order = searchParams.get("order") || "desc";
  const pageSize = parseInt(searchParams.get("pageSize")) || 10;
  const pageNumber = parseInt(searchParams.get("pageNumber")) || 1;

  const paginationKey = `${filterStatus}-${sortBy}-${order}`;

  const bookingQuery = useCustomQuery(
    "bookings",
    filterBookingsData,
    [filterStatus, sortBy, order, pageSize, pageNumber],
    {
      keepPreviousData: true,

      refetchOnWindowFocus: true,
      onSuccess: (data) => {
        // This is your onSuccess callback
        console.log("fetching is completed");
        setUpdatingBooking(null);
      },

      // ... other options
    }
  );

  const deleteBookingMutation = useDataMutation(
    deleteBooking,
    ["bookings"],
    () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });

      onClose();
    },
    (err) => {
      toast.error(err.message);
      onClose();
    }
  );
  const checkStatusMutation = useDataMutation(
    updateBookingStatus,
    ["bookings"],
    () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });

      onClose();
    },
    (err) => {
      toast.error(err.message);
      onClose();
    }
  );

  if (pageNumber < numberOfPages) {
    queryClient.prefetchQuery({
      queryKey: [
        "bookings",
        filterStatus,
        sortBy,
        order,
        pageSize,
        pageNumber + 1,
      ],
      queryFn: () =>
        filterBookingsData(
          filterStatus,
          sortBy,
          order,
          pageSize,
          pageNumber + 1
        ),
    });
  }

  if (pageNumber > 1) {
    queryClient.prefetchQuery({
      queryKey: [
        "bookings",
        filterStatus,
        sortBy,
        order,
        pageSize,
        pageNumber - 1,
      ],
      queryFn: () =>
        filterBookingsData(
          filterStatus,
          sortBy,
          order,
          pageSize,
          pageNumber - 1
        ),
    });
  }
  const { data, isEmpty } = bookingQuery;
  const {
    bookingsWithDetails: allBookingList = [],
    nextPageToken: nextToken = null,
    prevPageToken: prevToken = null,
  } = isEmpty ? {} : data;

  const columns = [
    {
      Header: "",
      accessor: "id",
    },
    {
      Header: "CABIN",
      accessor: "cabinName",
      Cell: ({ value }) => {
        return <div className="dark:text-white">{value || "---"}</div>;
      },
    },
    {
      Header: "GUEST",
      accessor: "guestId",
      Cell: ({ cell: { value }, row: { original } }) => {
        return (
          <div className="space-y-1">
            <div className="font-semibold dark:text-white">
              {original.guestFullName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {original.guestEmail}
            </div>
          </div>
        );
      },
    },
    {
      Header: "DATES",
      Cell: ({ row }) => (
        <>
          <div className=" flex items-center gap-2">
            <div className="text-sm text-gray-900 dark:text-white font-bold">
              {TimeElapsed(row.original.startDate)}
            </div>
            <div className="font-semibold">→</div>
            <div className="text-sm text-gray-900 dark:text-white font-bold ">
              {`${differenceInDays(
                parseISO(row.original.endDate),
                parseISO(row.original.startDate)
              )} nights`}
            </div>
          </div>
          <div className=" flex items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-200">
              {formatDate(row.original.startDate)}
            </div>
            <div className="font-semibold dark:text-gray-300">→</div>
            <div className="text-xs text-gray-500">
              {formatDate(row.original.endDate)}
            </div>
          </div>
        </>
      ),
    },
    {
      Header: "STATUS",
      accessor: "status",
      Cell: ({ value, row }) => {
        const isUpdating =
          row.original.id === updatingBooking && bookingQuery.isFetching;
        return (
          <>
            {isUpdating && (
              <div className="w-2/4 flex  justify-center items-center">
                <Spinner size={"15px"} />
              </div>
            )}

            {!isUpdating && <span className="dark:text-white ">{value}</span>}
          </>
        );
      },
    },
    {
      Header: "AMOUNT",
      accessor: "totalPrice",
      Cell: ({ value }) => {
        return <div className="font-semibold dark:text-white">${value}</div>;
      },
    },
    {
      Header: "", // This is for the action icons/buttons
      accessor: "actions",
      Cell: ({ row }) => (
        <Menu>
          <Menu.Open>
            <FiMoreVertical
              scale={2}
              className="cursor-pointer dark:text-white"
            />
          </Menu.Open>
          <Menu.MenuItems>
            <Menu.Item icon={<HiEye className="text-gray-500" />}>
              <Link to={`/booking/${row.original.id}`}> See detalis</Link>
            </Menu.Item>

            {row.original.status === "Unconfirmed" && (
              <Modal.Open
                opens={"edit-confirm"}
                data={{ id: row.original.id, status: "Checked in" }}
              >
                <Menu.Item
                  icon={<BiSolidCheckCircle className="text-gray-500" />}
                >
                  <span>Check In</span>
                </Menu.Item>
              </Modal.Open>
            )}

            {row.original.status === "Checked in" && (
              <Modal.Open
                opens={"edit-confirm"}
                data={{ id: row.original.id, status: "Checked out" }}
              >
                <Menu.Item icon={<BiLogOut className="text-gray-500" />}>
                  <span>Check Out</span>
                </Menu.Item>
              </Modal.Open>
            )}

            <Modal.Open opens={"delete-confirm"} data={row.original.id}>
              <Menu.Item icon={<FiTrash2 className="text-gray-500" />}>
                <span> Delete Booking</span>
              </Menu.Item>
            </Modal.Open>
          </Menu.MenuItems>
        </Menu>
      ),
    },
  ];

  useEffect(() => {
    let hasChanged = false;

    // Validate 'status'
    if (!filtersList.includes(filterStatus)) {
      searchParams.set("status", "All");
      hasChanged = true;
    }

    // Validate 'sortBy'
    const validSortFields = sortingOptions.map((option) => option.field);
    if (!validSortFields.includes(sortBy)) {
      searchParams.set("sortBy", "created_at");
      hasChanged = true;
    }

    // Validate 'order'
    if (!["asc", "desc"].includes(order)) {
      searchParams.set("order", "desc");
      hasChanged = true;
    }

    // Validate 'pageSize'
    if (![3, 5, 10, 20].includes(parseInt(pageSize))) {
      searchParams.set("pageSize", 10);
      hasChanged = true;
    }

    // Update the URL if any changes were made
    if (hasChanged) {
      setSearchParams(searchParams);
    }
  }, [
    filterStatus,
    sortBy,
    order,
    pageSize,
    filtersList,
    sortingOptions,
    searchParams,
    setSearchParams,
  ]);
  useEffect(() => {
    const validateAndFetchData = async () => {
      let validStatus = filtersList.includes(filterStatus)
        ? filterStatus
        : "All";
      let validPageSize = [3, 5, 10, 20].includes(parseInt(pageSize))
        ? parseInt(pageSize)
        : 10;

      setNumberOfPages("-");

      const result = await getNumberOfPages(validStatus, validPageSize);
      // Assuming the API returns an object with a totalCount property
      setNumberOfPages(result);
    };

    validateAndFetchData();
  }, [filterStatus, pageSize]);
  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle>All Bookings</PageTitle>

        <div className="flex items-center gap-5">
          <FilterButtons filterName={"status"} filtersLists={filtersList} />
          <Dropdown sortingOptions={sortingOptions} />
        </div>
      </div>

      <div className="rounded-lg  overflow-hidden border-1 border-gray-200 dark:border-gray-900">
        <Table
          columns={columns}
          data={allBookingList}
          initialState={{ hiddenColumns: ["id"] }}
        >
          <Table.TableContent>
            <Table.TableHeader />
            {bookingQuery.isLoading ? (
              <Loader transparent={true} />
            ) : (
              <Table.TableBody />
            )}
          </Table.TableContent>
        </Table>
        <Pagination
          prevPageToken={prevToken}
          nextPageToken={nextToken}
          numberOfPages={numberOfPages}
          key={paginationKey}
        />
      </div>

      <Modal.Window name={"edit-confirm"} isSmall={true}>
        <ConfirmationMessage>
          <ConfirmationMessage.Content>
            {modalData?.status === "Checked in"
              ? "Are you sure you want to check in the booking"
              : "Are you sure you want to check out the booking"}
          </ConfirmationMessage.Content>
          <ConfirmationMessage.Actions
            handleYes={async () => {
              setUpdatingBooking(modalData.id);
              checkStatusMutation.mutate(modalData);
            }}
            handleCancel={onClose}
            isLoading={checkStatusMutation.isPending || bookingQuery.isFetching}
          />
        </ConfirmationMessage>
      </Modal.Window>

      <Modal.Window name={"delete-confirm"} isSmall={true}>
        <ConfirmationMessage>
          <ConfirmationMessage.Content>
            Are you sure you want to delete this cabin?
          </ConfirmationMessage.Content>
          <ConfirmationMessage.Actions
            handleCancel={onClose}
            isLoading={
              deleteBookingMutation.isPending || bookingQuery.isFetching
            }
            handleYes={async () => {
              deleteBookingMutation.mutate({ id: modalData });
            }}
          />
        </ConfirmationMessage>
      </Modal.Window>
    </>
  );
}

export default Bookings;
