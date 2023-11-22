import React, { useEffect, useState } from "react";
import Table from "../../components/TableV2";
import { FiCopy, FiEdit, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import EditCabinForm from "../../components/EditCabinForm";
import Button from "../../components/Button";
import AddCabinForm from "../../components/AddCabinForm";
import {
  deleteCabin,
  duplicateCabin,
  getCabins,
} from "../../store/actions/cabinsActions";
import ConfirmationMessage from "../../components/ConfirmationMessage";
import Loader from "../../components/Loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import useDataMutation from "../../hooks/useDataMutation";
import { useCustomQuery } from "../../hooks/queryHook";

import Modal, { useModalWindow } from "../../components/ModalV2";
import Menu from "../../components/ContextMenu";
import FilterButtons from "../../components/FilterButtons";
import Filter from "../../components/Filter";
import Dropdown from "../../components/Dropdown";
import Sort from "../../components/Sort";
import { useSearchParams } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
const filtersList = ["All", "Discount", "No discount"];
const filterMappings = {
  All: () => true, // or just (item) => item to return all items
  Discount: (item) => item.discount > 0,
  "No discount": (item) => item.discount === 0,
};
const sortingMappings = {
  "Name (A to Z)": (a, b) => a.name.localeCompare(b.name),
  "Name (Z to A)": (a, b) => b.name.localeCompare(a.name),
  "Sort by price (high first)": (a, b) => b.regularPrice - a.regularPrice,
  "Sort by price (low first)": (a, b) => a.regularPrice - b.regularPrice,
};
function Cabins() {
  const [isLoading, setIsLoading] = useState(false);
  const cabinsQuery = useCustomQuery("cabins", getCabins);
  const cabinsList = cabinsQuery.isEmpty ? [] : cabinsQuery.data;
  const { onClose, modalData } = useModalWindow();

  const [filteredCabinsList, setFilteredCabinsList] = useState(cabinsList);
  // State for sorted list
  const [sortedCabinsList, setSortedCabinsList] = useState([]);

  const deleteCabinMutation = useDataMutation(
    deleteCabin,
    ["cabins"],
    () => {
      onClose();
    },
    (err) => {
      toast.error(err.message);
      onClose();
    }
  );

  const copyMutation = useDataMutation(
    duplicateCabin,
    ["cabins"],
    () => {
      onClose();
    },
    (err) => {
      toast.error(err.message);
      onclose();
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "",
        accessor: "img",
        Cell: ({ cell: { value }, row: { original } }) => (
          <div className="flex items-center">
            <img src={original.image} alt="Cabin" className="w-12 h-10  mr-2" />
          </div>
        ),
      },

      {
        Header: "CABIN",
        accessor: "name",
        Cell: ({ value }) => {
          return <div className="dark:text-white">{value || "---"}</div>;
        },
      },
      {
        Header: "CAPACITY",
        accessor: "maxCapacity",
        Cell: ({ cell: { value }, row: { original } }) => (
          <p className="dark:text-white">
            Fits up to
            <span className="mx-1 font-bold dark:text-white">
              {original.maxCapacity}
            </span>
            guests
          </p>
        ),
      },
      {
        Header: "PRICE",
        accessor: "regularPrice",
        Cell: ({ cell: { value }, row: { original } }) => (
          <span className="mx-1 font-bold dark:text-white">
            ${original.regularPrice.toFixed(2)}
          </span>
        ),
      },
      {
        Header: "DISCOUNT",
        accessor: "discount",
        Cell: ({ cell: { value }, row: { original } }) => {
          return original.discount ? (
            <span className="mx-1 font-bold text-green-700">
              ${original.discount.toFixed(2)}
            </span>
          ) : (
            <span>&mdash;</span>
          );
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
              <Modal.Open opens={"copy-confirm"} data={row.original.id}>
                <Menu.Item icon={<FiCopy className="text-gray-500" />}>
                  <span> Duplicate Cabin</span>
                </Menu.Item>
              </Modal.Open>

              <Modal.Open opens={"edit-form"} data={row.original.id}>
                <Menu.Item icon={<FiEdit className="text-gray-500" />}>
                  <span> Edit Cabin</span>
                </Menu.Item>
              </Modal.Open>
              <Modal.Open opens={"delete-confirm"} data={row.original.id}>
                <Menu.Item icon={<FiTrash2 className="text-gray-500" />}>
                  <span> Delete Cabin</span>
                </Menu.Item>
              </Modal.Open>
            </Menu.MenuItems>
          </Menu>
        ),
      },
    ],
    []
  );

  // When filteredCabinsList changes, it should be sorted

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle>Cabins </PageTitle>
        <div className="flex items-center gap-5">
          <Filter
            filterName={"discount"}
            data={cabinsList}
            filterMappings={filterMappings}
            onFilteredDataChange={setFilteredCabinsList}
          />
          <Sort
            data={filteredCabinsList}
            setSortedData={setSortedCabinsList}
            sortingMappings={sortingMappings}
          />
        </div>
      </div>
      <div className="rounded-lg  overflow-hidden border-2 dark:border-slate-800">
        {cabinsQuery.isLoading ? (
          <Loader />
        ) : (
          <Table columns={columns} data={sortedCabinsList}>
            <Table.TableContent>
              <Table.TableHeader />
              <Table.TableBody />
            </Table.TableContent>
            <Table.TablePagination />
          </Table>
        )}
      </div>

      <div className=" m-5">
        <Modal.Open opens={"add-form"}>
          <Button>Add new cabin</Button>
        </Modal.Open>
      </div>
      <Modal.Window name={"add-form"} isLoading={isLoading}>
        <AddCabinForm setIsUpdating={setIsLoading} />
      </Modal.Window>
      <Modal.Window name={"edit-form"} isLoading={isLoading}>
        <EditCabinForm setIsUpdating={setIsLoading} cabinId={modalData} />
      </Modal.Window>
      <Modal.Window name={"delete-confirm"} isSmall={true}>
        <ConfirmationMessage>
          <ConfirmationMessage.Content>
            Are you sure you want to delete this cabin?
          </ConfirmationMessage.Content>
          <ConfirmationMessage.Actions
            handleCancel={onClose}
            isLoading={deleteCabinMutation.isPending || cabinsQuery.isFetching}
            handleYes={async () => {
              deleteCabinMutation.mutate({ id: modalData });
            }}
          />
        </ConfirmationMessage>
      </Modal.Window>
      <Modal.Window name={"copy-confirm"} isSmall={true}>
        <ConfirmationMessage>
          <ConfirmationMessage.Content>
            Are you sure you want to duplicate this cabin?
          </ConfirmationMessage.Content>
          <ConfirmationMessage.Actions
            handleYes={async () => {
              const { id, ...cabin } = cabinsList.find(
                (g) => g.id === modalData
              );
              copyMutation.mutate({ cabinData: cabin });
            }}
            handleCancel={onClose}
            isLoading={copyMutation.isPending || cabinsQuery.isFetching}
          />
        </ConfirmationMessage>
      </Modal.Window>
      {/* <CabinModals
        modalData={modalData}
        openModal={openModal}
        handleModelClose={handleModelClose}
      />

      <Confirmation
        modalData={modalData}
        openModal={openModal}
        handleModelClose={handleModelClose}
      /> */}
    </>
  );
}

export default Cabins;
