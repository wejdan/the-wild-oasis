import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import FormInput from "../components/FormInput";
import { createNewUser, registerUser } from "../store/actions/userActions";
import toast, { Toaster } from "react-hot-toast";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import PageTitle from "../components/PageTitle";
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
function UsersPages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isDarkMode = useSelector((state) => state.appSettings.isDarkMode);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const password = watch("password");
  console.log("errors", errors);
  const onSubmit = async (data) => {
    setError(null);

    setLoading(true);
    createNewUser(data.email, data.password, data.name)
      .then((uid) => {
        toast.success("User created successfuly.");
        reset();
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });

    // Handle submit logic
  };
  return (
    <div>
      <PageTitle>Create a new user</PageTitle>
      <div className="flex flex-col  w-full space-y-8 bg-white dark:bg-gray-800 px-16 py-7  rounded-md ">
        {error && (
          <span
            className={`text-xs self-center select-none text-red-900 bg-red-200 px-4 p-2 rounded-md text-center  transition-opacity duration-300 ease-in-out ${
              error ? "opacity-100" : "opacity-0"
            }`}
          >
            {error}
          </span>
        )}
        <form className=" space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormContainer>
            <FormInput
              label="Full Name"
              id="name"
              placeholder="Full Name"
              error={errors.name?.message}
              {...register("name", {
                required: "This field is required",
              })}
            />

            <FormInput
              label="Email address"
              id="email"
              placeholder="Email address"
              error={errors.email?.message}
              {...register("email", {
                required: "This field is required",
                pattern: { value: emailRegex, message: "enter a valid email" },
              })}
            />

            <FormInput
              label="Password (min 8 characters)"
              id="password"
              placeholder="Password"
              type="password"
              error={errors.password?.message}
              {...register("password", {
                required: "This field is required",
                minLength: { value: 8, message: "Minimum length is 8" },
              })}
            />

            <FormInput
              label="Repeat Password"
              id="confirmPassword"
              placeholder="Repeat Password"
              type="password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "This field is required",
                minLength: { value: 8, message: "Minimum length is 8" },
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
          </FormContainer>

          <div className="flex justify-end gap-2 ">
            <Button
              loading={loading}
              disabled={errors && Object.keys(errors).length > 0}
              type="submit"
            >
              Create new user
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsersPages;
