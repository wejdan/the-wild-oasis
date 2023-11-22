import React, { useState } from "react";
import Logo from "../components/Logo";
import Container from "../components/Container";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Input from "../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/actions/userActions";
import { Controller, useForm } from "react-hook-form";
const initialFormValues = {
  email: "",
  password: "",
};

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const {
    register,
    control,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialFormValues });

  const formData = watch();
  const isDisabled = Object.values(formData).some(
    (value) => value === undefined || value === null || value === ""
  );

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
      setLoading(false);
      //  navigatt("/"); // Redirect to dashboard upon successful login
    } catch (error) {
      setError("Invalid email or password.");
      reset();
      setLoading(false);
    }
    // Handle submit logic
  };
  return (
    <div className=" flex flex-col items-center w-1/3">
      <Logo width={"200px"} />
      <h2 className="my-8 text-center text-2xl font-extrabold text-gray-800 dark:text-white">
        Log in to your account
      </h2>
      {error && (
        <span
          className={`text-xs mb-3 self-center select-none text-red-900 bg-red-200 px-4 p-2 rounded-md text-center  transition-opacity duration-300 ease-in-out ${
            error ? "opacity-100" : "opacity-0"
          }`}
        >
          {error}
        </span>
      )}
      <div className="w-full space-y-8 bg-white dark:bg-gray-900 px-10 py-7  rounded-md ">
        <form className=" space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-5">
            <Controller
              render={({ field }) => (
                <Input
                  label={"Email address"}
                  id="email"
                  placeholder="Email address"
                  type="email"
                  {...field}
                />
              )}
              control={control}
              name="email"
              rules={{ required: true }}
            />

            <Controller
              render={({ field }) => (
                <Input
                  label={"Password"}
                  id="password"
                  placeholder="Password"
                  type="password"
                  {...field}
                />
              )}
              control={control}
              name="password"
              rules={{ required: true }}
            />
          </div>

          <div className="flex flex-col items-stretch">
            <Button loading={loading} disabled={isDisabled} type="submit">
              Log in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
