import React, { useState } from "react";
import FormInput from "./FormInput";
import Button from "./Button";
import { useSelector } from "react-redux";
import { addCabin, updateCabin } from "../store/actions/cabinsActions";
import { uploadeImg } from "../utils";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useDataMutation from "../hooks/useDataMutation";
import { toast } from "react-hot-toast";
import FormContainer from "./FormContainer";

function AddCabinForm({ onClose, setIsUpdating }) {
  // Initialize the state with one object

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const [error, setError] = useState(null); // To store the error
  const onRevert = () => {
    setValue("image", null);
  };
  const formImage = watch("image");
  const formValues = watch();

  const mutation = useDataMutation(
    addCabin,
    ["cabins"],
    () => {
      onClose();
    },
    (err) => {
      setError(err);
      toast.error(err.message);
      setIsUpdating(false);
    }
  );

  const onSubmit = async (data) => {
    setIsUpdating(true);
    let processedData = {
      ...data,
      maxCapacity: Number(data.maxCapacity),
      regularPrice: Number(data.regularPrice),
      discount: Number(data.discount),
    };

    mutation.mutate({ cabinData: processedData });
  };
  const onError = (errs) => {
    console.log("errs", errs);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className=" space-y-6">
      <FormContainer>
        <FormInput
          label="Cabin name"
          id="name"
          error={errors.name?.message}
          {...register("name", {
            required: "This field is required",
          })}
        />

        <FormInput
          label="Maximum Capacity"
          id="maxCapacity"
          error={errors.maxCapacity?.message}
          {...register("maxCapacity", {
            required: "This field is required",
            min: { value: 1, message: "capacity should be at least 1" },
            pattern: {
              value: /^\d+(\.\d+)?$/, // regex to check if input is a number
              message: "Only numbers are allowed",
            },
          })}
        />

        <FormInput
          label="Regular price"
          id="regularPrice"
          error={errors.regularPrice?.message}
          {...register("regularPrice", {
            required: "This field is required",
            min: { value: 1, message: "Price should be at least 1" },

            pattern: {
              value: /^\d+(\.\d+)?$/, // regex to check if input is a number
              message: "Only numbers are allowed",
            },
          })}
        />

        <FormInput
          label="Discount"
          id="discount"
          error={errors.discount?.message}
          {...register("discount", {
            required: "This field is required",
            pattern: {
              value: /^\d+(\.\d+)?$/, // regex to check if input is a number
              message: "Only numbers are allowed",
            },
            validate: (value) =>
              Number(value) < Number(formValues.regularPrice) ||
              "Discount must be less than the price",
          })}
        />

        <FormInput
          textArea={true}
          label="Description for website"
          id="description"
          error={errors.description?.message}
          {...register("description", {
            required: "This field is required",
          })}
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
                error={errors.image?.message}
              />
            )}
            control={control}
            name="image"
            rules={{ required: "Add a picture for the cabin" }}
          />
        </div>
        {formImage && (
          <img src={URL.createObjectURL(formImage)} className="w-10 h-10" />
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
          disabled={Object.keys(errors).length > 0}
          type="submit"
        >
          Add cabin
        </Button>
      </div>
    </form>
  );
}

export default AddCabinForm;
