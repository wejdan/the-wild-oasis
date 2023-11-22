import React, { useState } from "react";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import {
  readSettings,
  updateSettingsAction,
} from "../store/actions/settingsActions";
import { useSelector } from "react-redux";
import { useCustomQuery } from "../hooks/queryHook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import PageTitle from "../components/PageTitle";

function SettingsPage() {
  //const settings = useSelector((state) => state.settings.appSettings);
  const queryClient = useQueryClient();

  const settingsQuery = useCustomQuery("settings", readSettings);
  const settings = settingsQuery.isEmpty ? [] : settingsQuery.data;

  const { register, control, handleSubmit, watch, getValues, errors, reset } =
    useForm();
  const [error, setError] = useState(null);
  const formData = watch();

  // Check if all fields are equal to their corresponding properties in `settings`
  const isSameOrEmpty = Object.keys(formData).some(
    (key) => formData[key] && Number(formData[key]) !== settings[key]
  );

  const isDisabled = !isSameOrEmpty || settingsQuery.isFetching;

  const mutation = useMutation({
    mutationFn: updateSettingsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings updated successfuly.");
    },
    onError: (err) => {
      // Set the error to local state when mutation fails
      setError(err);
    },
  });
  const onSubmit = async (data) => {
    setError(null);
    const parsedData = {
      minBookingLength: Number(data.minBookingLength),
      maxBookingLength: Number(data.maxBookingLength),
      maxGuestsPerBooking: Number(data.maxGuestsPerBooking),
      breakfastPrice: Number(data.breakfastPrice),
    };

    mutation.mutate({ data: parsedData });
  };
  const handleUpdate = (e, field) => {
    const parsedData = {
      [field]: Number(e.target.value),
    };
    mutation.mutate({ data: parsedData });
  };
  function handleKeyPress(event) {
    if (!/\d/.test(event.key)) {
      event.preventDefault();
    }
  }
  return (
    <div>
      <PageTitle>Update hotel settings</PageTitle>
      {settingsQuery.isPending ? (
        <Loader />
      ) : (
        <div className="w-full space-y-8 bg-white dark:bg-gray-800 px-16 py-7  rounded-md ">
          <form className=" space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormContainer>
              <FormInput
                label={"Minimum nights/booking"}
                id="minBookingLength"
                onBlur={(e) => handleUpdate(e, "minBookingLength")}
                disabled={mutation.isPending}
                defaultValue={settings.minBookingLength}
                onKeyPress={handleKeyPress}
              />

              <FormInput
                label={"Maximum nights/booking"}
                id="maxBookingLength"
                onBlur={(e) => handleUpdate(e, "maxBookingLength")}
                disabled={mutation.isPending}
                defaultValue={settings.maxBookingLength}
                onKeyPress={handleKeyPress}
              />

              <FormInput
                label={"Maximum guests/booking"}
                id="maxGuestsPerBooking"
                onBlur={(e) => handleUpdate(e, "maxGuestsPerBooking")}
                disabled={mutation.isPending}
                defaultValue={settings.maxGuestsPerBooking}
                onKeyPress={handleKeyPress}
              />

              <FormInput
                label={"Breakfast Price"}
                id="breakfastPrice"
                onBlur={(e) => handleUpdate(e, "breakfastPrice")}
                disabled={mutation.isPending}
                defaultValue={settings.breakfastPrice}
                onKeyPress={handleKeyPress}
              />
            </FormContainer>
          </form>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
