import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { uploadeImg } from "../utils";
import { getUserData, updateUserData } from "../store/actions/userActions";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { Controller, useForm } from "react-hook-form";
import { useCustomQuery } from "../hooks/queryHook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useDataMutation from "../hooks/useDataMutation";
import useAuth from "../hooks/useAuth";
import { auth } from "../firebase";
import PageTitle from "../components/PageTitle";
import FormContainer from "../components/FormContainer";

function UserSettings() {
  const {
    register,
    control,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const userId = auth.currentUser.uid;
  const [resetCounter, setResetCounter] = useState(0);
  const userQuery = useCustomQuery("users", getUserData, [
    auth.currentUser.uid,
  ]);
  const userData = userQuery.isEmpty ? {} : userQuery.data;

  const formData = watch();

  const isSameOrEmpty = ["name", "email"].some(
    (key) => formData[key]?.trim() && formData[key] !== userData[key]
  );
  const isEditPassword =
    formData.confirmPassword?.trim() && formData.password?.trim();
  const isDisabled = !isSameOrEmpty && !formData.avatar && !isEditPassword;

  // useEffect(() => {
  //   setValue("avatar", null);
  // }, [userData.avatar]);
  const onRevert = () => setValue("avatar", null);
  const resetForm = () => {
    reset();
    setValue("avatar", null);
    setValue("password", "");
    setValue("confirmPassword", "");
    setResetCounter((prev) => prev + 1); // Increment to trigger re-render
  };
  const mutation = useDataMutation(
    updateUserData,
    ["users"],
    () => {
      toast.success("Data updated successfuly.");

      setValue("avatar", null);
      setValue("password", "");
      setValue("confirmPassword", "");
    },
    (err) => {
      toast.error(err.message);
    }
  );
  const onSubmit = async (data) => {
    console.log(data);
    mutation.mutate({ id: userId, data });

    // Handle submit logic
  };
  return (
    <div>
      <PageTitle>Create a new user</PageTitle>
      <div className="w-full space-y-8 bg-white dark:bg-gray-800 px-16 py-7  rounded-md ">
        <form className=" space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormContainer>
            <Controller
              render={({ field }) => (
                <FormInput
                  label={"Email address"}
                  id="email-address"
                  placeholder="Email address"
                  type="email"
                  {...field}
                />
              )}
              control={control}
              name="email"
              rules={{ required: true }}
              defaultValue={userData.email}
            />

            <Controller
              render={({ field }) => (
                <FormInput
                  label={"Full Name"}
                  id="name"
                  placeholder="Full Name"
                  {...field}
                />
              )}
              control={control}
              name="name"
              rules={{ required: true }}
              defaultValue={userData.name}
            />
            <Controller
              render={({ field }) => (
                <FormInput
                  label={"Password"}
                  id="password"
                  placeholder="Password"
                  type="password"
                  error={errors.password?.message}
                  autocomplete="new-password"
                  {...field}
                />
              )}
              control={control}
              name="password"
              rules={{
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              }}
            />

            {/* Confirm Password Field */}
            <Controller
              render={({ field }) => (
                <FormInput
                  label={"Confirm Password"}
                  id="confirm-password"
                  placeholder="Confirm Password"
                  error={errors.confirmPassword?.message}
                  type="password"
                  {...field}
                />
              )}
              control={control}
              name="confirmPassword"
              rules={{
                validate: (value) =>
                  value === watch("password") || "Passwords don't match",
              }}
            />
            <Controller
              render={({ field }) => (
                <FormInput
                  key={`${userData.avatar}${resetCounter}`}
                  type="file"
                  label={"Avatar"}
                  id="avatar"
                  field={field} // Passing the field object
                  revert={onRevert}
                />
              )}
              control={control}
              name="avatar"
            />

            <img
              src={
                formData.avatar
                  ? URL.createObjectURL(formData.avatar)
                  : userData.avatar
              }
              className="w-10 h-10"
              alt="New cabin image"
            />
          </FormContainer>

          <div className="flex justify-end gap-2 ">
            <Button
              onClick={resetForm}
              outline={true}
              disabled={isDisabled}
              type="button" // Set the button type to 'button'
            >
              Cancel
            </Button>
            <Button
              loading={mutation.isPending}
              disabled={
                isDisabled ||
                userQuery.isFetching ||
                Object.keys(errors).length > 0
              }
              type="submit"
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserSettings;
