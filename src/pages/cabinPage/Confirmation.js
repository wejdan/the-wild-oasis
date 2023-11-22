import React from "react";
import Modal, { useModal } from "../../components/Modal";
import ConfirmationMessage from "../../components/ConfirmationMessage";
import useDataMutation from "../../hooks/useDataMutation";
import {
  deleteCabin,
  duplicateCabin,
  getCabins,
} from "../../store/actions/cabinsActions";
import { toast } from "react-hot-toast";
import { useCustomQuery } from "../../hooks/queryHook";

function Confirmation({ openModal, handleModelClose, modalData }) {
  const [DeleteConfirmation, toggleDeleteConfirmation] = useModal({
    isSmall: true,
  });
  const [CopyConfirmation, toggleCopyConfirmation] = useModal({
    isSmall: true,
  });

  const cabinsQuery = useCustomQuery("cabins", getCabins);
  const cabinsList = cabinsQuery.isEmpty ? [] : cabinsQuery.data;

  const deleteCabinMutation = useDataMutation(
    deleteCabin,
    ["cabins"],
    () => {
      handleModelClose();
    },
    (err) => {
      toast.error(err.message);
      handleModelClose();
    }
  );

  const copyMutation = useDataMutation(
    duplicateCabin,
    ["cabins"],
    () => {
      handleModelClose();
    },
    (err) => {
      toast.error(err.message);
      handleModelClose();
    }
  );
  return (
    <>
      <DeleteConfirmation>
        <DeleteConfirmation.Close
          isDisabled={deleteCabinMutation.isPending || cabinsQuery.isFetching}
        />

        <DeleteConfirmation.Content>
          <ConfirmationMessage>
            <ConfirmationMessage.Content>
              Are you sure you want to delete this cabin?
            </ConfirmationMessage.Content>
            <ConfirmationMessage.Actions
              handleCancel={handleModelClose}
              isLoading={
                deleteCabinMutation.isPending || cabinsQuery.isFetching
              }
              handleYes={async () => {
                deleteCabinMutation.mutate({ id: modalData });
              }}
            />
          </ConfirmationMessage>
        </DeleteConfirmation.Content>
      </DeleteConfirmation>

      <CopyConfirmation>
        <Modal.Close
          isDisabled={copyMutation.isPending || cabinsQuery.isFetching}
        />

        <CopyConfirmation.Content>
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
              handleCancel={handleModelClose}
              isLoading={copyMutation.isPending || cabinsQuery.isFetching}
            />
          </ConfirmationMessage>
        </CopyConfirmation.Content>
      </CopyConfirmation>
    </>
  );
}

export default Confirmation;
