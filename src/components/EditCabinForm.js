import React from "react";
import FormInput from "./FormInput";
import Button from "./Button";
import { useSelector } from "react-redux";
import { getCabins, updateCabin } from "../store/actions/cabinsActions";
import { uploadeImg } from "../utils";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useDataMutation from "../hooks/useDataMutation";
import FormContainer from "./FormContainer";
function EditCabinForm({ onClose, cabinId, setIsUpdating }) {
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const query = useQuery({ queryKey: ["cabins"], queryFn: getCabins });
  console.log("1.EditCabinForm was re-rendered");
  const cabinsList = query.data ? query.data : [];
  const selectedCabin = cabinsList.find((item) => item.id === cabinId);
  const formData = watch();

  const isImageChanged =
    formData.image && formData.image !== selectedCabin?.image;
  const isSameOrEmpty =
    selectedCabin &&
    ["name", "maxCapacity", "regularPrice", "discount", "description"].some(
      (key) => formData[key] && formData[key] !== selectedCabin[key]
    );
  const isDisabled = (!isSameOrEmpty && !isImageChanged) || false;

  const onRevert = () => setValue("image", null);

  const mutation = useDataMutation(
    updateCabin,
    ["cabins"],
    () => {
      setIsUpdating(false);

      onClose();
    },
    (err) => {
      setIsUpdating(false);

      toast.error(err.message);
    }
  );
  const onSubmit = async (data) => {
    setIsUpdating(true);
    let newData = {
      ...data,
      maxCapacity: Number(data.maxCapacity),
      regularPrice: Number(data.regularPrice),
      discount: Number(data.discount),
    };
    mutation.mutate({ id: cabinId, data: newData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" space-y-6">
      <FormContainer>
        <Controller
          render={({ field }) => (
            <FormInput label={"Cabin name"} id="name" {...field} />
          )}
          control={control}
          name="name"
          rules={{ required: true }}
          defaultValue={selectedCabin?.name || ""}
        />
        <Controller
          render={({ field }) => (
            <FormInput
              label={"Maximum Capacity "}
              id="maxCapacity"
              {...field}
              type="number"
            />
          )}
          control={control}
          name="maxCapacity"
          rules={{ required: true }}
          defaultValue={selectedCabin?.maxCapacity || 0}
        />
        <Controller
          render={({ field }) => (
            <FormInput
              label={"Regular price"}
              id="regularPrice"
              {...field}
              type="number"
            />
          )}
          control={control}
          name="regularPrice"
          rules={{ required: true }}
          defaultValue={selectedCabin?.regularPrice || 0}
        />
        <Controller
          render={({ field }) => (
            <FormInput
              label={"Discount"}
              id="discount"
              {...field}
              type="number"
            />
          )}
          control={control}
          name="discount"
          rules={{ required: true }}
          defaultValue={selectedCabin?.discount || 0}
        />
        <Controller
          render={({ field }) => (
            <FormInput
              textArea={true}
              label={"description for website"}
              id="description"
              {...field}
            />
          )}
          control={control}
          name="description"
          rules={{ required: true }}
          defaultValue={selectedCabin?.description || ""}
        />
        {/* For the file input, you might need additional logic to handle file uploads */}
        <div className=" flex items-center">
          <Controller
            render={({ field }) => (
              <FormInput
                type="file"
                label={"Cabin photo"}
                id="image"
                field={field} // Passing the field object
                revert={onRevert}
              />
            )}
            control={control}
            name="image"
          />
        </div>
        {selectedCabin?.image && !formData.image && (
          <div>
            <img
              src={selectedCabin.image}
              className="w-10 h-10"
              alt="Current cabin image"
            />
          </div>
        )}
        {formData.image && (
          <div>
            <img
              src={URL.createObjectURL(formData.image)}
              className="w-10 h-10"
              alt="New cabin image"
            />
          </div>
        )}
      </FormContainer>

      <div className="flex justify-end gap-2 ">
        <Button
          type="button"
          disabled={mutation.isPending}
          onClick={onClose}
          outline={true}
        >
          Cancel
        </Button>
        <Button
          loading={mutation.isPending}
          disabled={isDisabled}
          type="submit"
        >
          Edit cabin
        </Button>
      </div>
    </form>
  );
}

export default EditCabinForm;
