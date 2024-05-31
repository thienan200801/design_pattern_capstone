import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import * as yup from "yup";
import authApi from "../../../api/authApi";
import bg from "../../../assets/images/loginBG.png";
import { SubmitButton } from "../../../components/commons";
import { showSuccessModal } from "../../../components/modals/CommonModals";
import { useHandleResponseError } from "../../../hooks/useHandleResponseError";

interface IRegisterProps {}

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required!"),
  lastName: yup.string().required("Last name is required!"),
  address: yup.string().required("Address is required!"),
  password: yup
    .string()
    .required("Password is required!")
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required("Password is required!"),
  email: yup
    .string()
    .email("Please enter a correctly formatted email address")
    .required("Email is required!"),
  gender: yup.number().min(0).required("Gender is required!"),
  age: yup
    .number()
    .required("Age is required!")
    .min(5, "Please enter an age between 5 and 70.")
    .max(70, "Please enter an age between 5 and 70.")
    .typeError("Age must be a number"),
});

interface ShowPasswordProps {
  password: boolean;
  confirm: boolean;
}

interface RegisterFormProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  gender: number;
  age: number;
}

const defaultValues: RegisterFormProps = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  address: "",
  gender: 0,
  age: 18,
};

const Register: React.FunctionComponent<IRegisterProps> = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<RegisterFormProps>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });
  const handleResponseError = useHandleResponseError("Register Error");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<ShowPasswordProps>({
    password: false,
    confirm: false,
  });

  const onSubmit = async (data: RegisterFormProps) => {
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _, ...rest } = data;
    const { ok, error } = await authApi.register(rest);
    setIsLoading(false);
    if (ok) {
      showSuccessModal({
        content: "Your account has been successfully created!",
        title: "Registration Successful",
      });
      reset();
      return;
    }
    handleResponseError(error);
  };

  return (
    <>
      <div className="register-page">
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <h2 className="welcome">Welcome!</h2>
          <div className="title">
            <h2>Sign up to</h2>
            <span>Ielts Tinder ?</span>
          </div>
          <div
            className={`grid grid-cols-2 gap-2 ${
              errors.firstName || errors.lastName ? "mb-0" : "mb-1"
            }`}
          >
            <div className="primary-input col-span-1">
              <label htmlFor="first-name">First Name</label>
              <input
                type="text"
                id="first-name"
                autoComplete="off"
                placeholder="Enter your first name"
                {...register("firstName")}
              />
              {errors.firstName && (
                <span className="error">{errors.firstName.message}</span>
              )}
            </div>
            <div className="primary-input col-span-1">
              <label htmlFor="last-name">Last Name</label>
              <input
                type="text"
                id="last-name"
                autoComplete="off"
                placeholder="Enter your last name"
                {...register("lastName")}
              />
              {errors.lastName && (
                <span className="error">{errors.lastName.message}</span>
              )}
            </div>
          </div>
          <div
            className={`grid grid-cols-2 gap-2 ${
              errors.email || errors.address ? "mb-0" : "mb-1"
            }`}
          >
            <div className="primary-input col-span-1">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                autoComplete="off"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <span className="error">{errors.email.message}</span>
              )}
            </div>
            <div className="primary-input col-span-1">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                autoComplete="off"
                placeholder="Enter your address"
                {...register("address")}
              />
              {errors.address && (
                <span className="error">{errors.address.message}</span>
              )}
            </div>
          </div>
          <div
            className={`grid grid-cols-2 gap-2 ${
              errors.password || errors.confirmPassword ? "mb-0" : "mb-1"
            }`}
          >
            <div className="primary-input col-span-1">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword.password ? "text" : "password"}
                id="password"
                autoComplete="off"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required!",
                })}
              />
              {errors.password && (
                <span className="error">{errors.password.message}</span>
              )}
              {showPassword.password ? (
                <FaEye
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                  className="primary-input__icon"
                />
              ) : (
                <FaEyeSlash
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                  className="primary-input__icon"
                />
              )}
            </div>
            <div className="primary-input col-span-1">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type={showPassword.confirm ? "text" : "password"}
                id="confirm-password"
                autoComplete="off"
                placeholder="Enter your password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword.message}</span>
              )}
              {showPassword.confirm ? (
                <FaEye
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="primary-input__icon"
                />
              ) : (
                <FaEyeSlash
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="primary-input__icon"
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-0">
            <div className="primary-input col-span-1">
              <label htmlFor="age">Age</label>
              <input
                type={"text"}
                id="age"
                autoComplete="off"
                placeholder="Enter your age"
                {...register("age")}
              />
              {errors.age && (
                <span className="error">{errors.age.message}</span>
              )}
            </div>
            <div className="primary-input col-span-1">
              <label htmlFor="gender">Gender</label>
              <select id="gender" {...register("gender")}>
                <option value={1}>Male</option>
                <option value={0}>Female</option>
              </select>

              {errors.gender && (
                <span className="error">{errors.gender.message}</span>
              )}
            </div>
          </div>

          <SubmitButton isLoading={isLoading} content="Register" />
          <p className="login-form__footer">
            Already have an Account ?{" "}
            <Link className="link" to={"/login"}>
              Login
            </Link>
          </p>
        </form>
        <img src={bg} alt="background" />
      </div>
    </>
  );
};

export default Register;
