import React, { useState } from "react";
import Table from "../../components/TableV2";
import { FiCopy, FiEdit, FiTrash2 } from "react-icons/fi";
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

import {
  useModal,
  Header,
  Close,
  Content,
  Actions,
} from "../../components/Modal";

function Cabins() {
  const [isLoading, setIsLoading] = useState(false);
  const cabinsQuery = useCustomQuery("cabins", getCabins);
  const cabinsList = cabinsQuery.isEmpty ? [] : cabinsQuery.data;
  console.log("2.Cabins was re-rendered");

  const [AddCabinModal, toggleAddCabinModal] = useModal();
  const [EditCabinModal, toggleEditCabinModal, editCabinId] = useModal();
  const [DeleteConfirmation, toggleDeleteConfirmation, deleteCabinId] =
    useModal({
      isSmall: true,
    });
  const [CopyConfirmation, toggleCopyConfirmation, copyCabinId] = useModal({
    isSmall: true,
  });

  const deleteCabinMutation = useDataMutation(
    deleteCabin,
    ["cabins"],
    () => {
      toggleDeleteConfirmation();
    },
    (err) => {
      toast.error(err.message);
      toggleDeleteConfirmation();
    }
  );

  const copyMutation = useDataMutation(
    duplicateCabin,
    ["cabins"],
    () => {
      toggleCopyConfirmation();
    },
    (err) => {
      toast.error(err.message);
      toggleCopyConfirmation();
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
      },
      {
        Header: "CAPACITY",
        accessor: "maxCapacity",
        Cell: ({ cell: { value }, row: { original } }) => (
          <p>
            Fits up to
            <span className="mx-1 font-bold">{original.maxCapacity}</span>guests
          </p>
        ),
      },
      {
        Header: "PRICE",
        accessor: "regularPrice",
        Cell: ({ cell: { value }, row: { original } }) => (
          <span className="mx-1 font-bold">
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
          <div className="flex space-x-2">
            <button
              onClick={() => {
                // setOpenModal("DUPLICATE_CABIN");
                // setModalData(row.original.id);
                toggleCopyConfirmation(row.original.id);
              }}
              className="p-2 bg-white hover:bg-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-gray-200"
            >
              <FiCopy className="text-gray-500" />
            </button>
            <button
              onClick={() => {
                // setOpenModal("EDIT_CABIN");
                // setModalData(row.original.id);

                toggleEditCabinModal(row.original.id);
              }}
              className="p-2 bg-white hover:bg-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-gray-200"
            >
              <FiEdit className="text-gray-500" />
            </button>
            <button
              onClick={() => {
                // setOpenModal("DELETE_CABIN");
                // setModalData(row.original.id);
                toggleDeleteConfirmation(row.original.id);
              }}
              className="p-2 bg-white hover:bg-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-gray-200"
            >
              <FiTrash2 className="text-gray-500" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <h2 className="my-8 text-2xl font-extrabold text-gray-800">Cabins</h2>

      <div className="rounded-lg  overflow-hidden border-2">
        {cabinsQuery.isLoading ? (
          <Loader />
        ) : (
          <Table columns={columns} data={cabinsList}></Table>
        )}
      </div>
      <div className=" m-5">
        <Button
          onClick={() => {
            //  setOpenModal("ADD_CABIN");
            toggleAddCabinModal();
          }}
        >
          Add new cabin
        </Button>
      </div>
      <AddCabinModal>
        <Close isDisabled={isLoading} />
        <Content>
          <AddCabinForm
            setIsUpdating={setIsLoading}
            onClose={toggleAddCabinModal}
          />
        </Content>
      </AddCabinModal>

      <EditCabinModal>
        <Close isDisabled={isLoading} />
        <Content>
          <EditCabinForm
            setIsUpdating={setIsLoading}
            cabinId={editCabinId}
            onClose={toggleEditCabinModal}
          />
        </Content>
      </EditCabinModal>

      <DeleteConfirmation>
        <Close
          isDisabled={deleteCabinMutation.isPending || cabinsQuery.isFetching}
        />

        <Content>
          <ConfirmationMessage>
            <ConfirmationMessage.Content>
              Are you sure you want to delete this cabin?
            </ConfirmationMessage.Content>
            <ConfirmationMessage.Actions
              handleCancel={toggleDeleteConfirmation}
              isLoading={
                deleteCabinMutation.isPending || cabinsQuery.isFetching
              }
              handleYes={async () => {
                deleteCabinMutation.mutate({ id: deleteCabinId });
              }}
            />
          </ConfirmationMessage>
        </Content>
      </DeleteConfirmation>

      <CopyConfirmation>
        <Close isDisabled={copyMutation.isPending || cabinsQuery.isFetching} />

        <Content>
          <ConfirmationMessage>
            <ConfirmationMessage.Content>
              Are you sure you want to duplicate this cabin?
            </ConfirmationMessage.Content>
            <ConfirmationMessage.Actions
              handleYes={async () => {
                const { id, ...cabin } = cabinsList.find(
                  (g) => g.id === copyCabinId
                );
                copyMutation.mutate({ cabinData: cabin });
              }}
              handleCancel={toggleCopyConfirmation}
              isLoading={copyMutation.isPending || cabinsQuery.isFetching}
            />
          </ConfirmationMessage>
        </Content>
      </CopyConfirmation>

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
