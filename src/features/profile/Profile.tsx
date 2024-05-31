import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaBirthdayCake,
  FaFemale,
  FaHome,
  FaMale,
  FaUser,
  FaFlag,
} from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { useEffectOnce } from "usehooks-ts";
import * as yup from "yup";
import profileApi from "../../api/profileApi";
import { useAppDispatch } from "../../app/hooks";
import {
  showErrorModal,
  showSuccessModal,
} from "../../components/modals/CommonModals";
import { useHandleResponseError } from "../../hooks/useHandleResponseError";
import { UserProfileModel } from "../../models/user";
import { setLoading, updateUserProfile } from "../../redux/globalSlice";

interface ProfileProps {}

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required!"),
  lastName: yup.string().required("Last name is required!"),
  address: yup.string().required("Address is required!"),
  gender: yup.number().min(0).required("Gender is required!"),
  age: yup
    .number()
    .required("Age is required!")
    .min(5, "Please enter an age between 5 and 70.")
    .max(70, "Please enter an age between 5 and 70.")
    .typeError("Age must be a number"),
  level: yup.string(),
});

export interface UpdateFormProps {
  firstName: string;
  lastName: string;
  address: string;
  gender: number;
  age: number;
}

const initialState: UserProfileModel = {
  id: 0,
  first_name: "",
  last_name: "",
  email: "",
  address: "",
  gender: "",
  age: 0,
  description: "",
  avatar: "",
  token: "",
  level: "A1",
};

const Profile: React.FunctionComponent<ProfileProps> = () => {
  const dispatch = useAppDispatch();
  const handlResponseError = useHandleResponseError();

  const [profile, setProfile] = useState<UserProfileModel>(initialState);
  const [isOpenChangeAvatar, setIsOpenChangeAvatar] = useState<boolean>(false);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const [isOpenChageUserInfo, setIsOpenChageUserInfo] =
    useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateFormProps>({
    resolver: yupResolver(validationSchema),
  });

  const handleChangeAvatar = async () => {
    const formData = new FormData();

    if (
      inputImageRef.current &&
      inputImageRef.current.files &&
      inputImageRef.current.files[0]
    ) {
      formData.append("image", inputImageRef.current.files[0]);
    } else {
      showErrorModal({
        content: "Please choose image to change",
        title: "Error",
        onOk: () => {},
      });
      return;
    }

    dispatch(setLoading("ADD"));
    const { ok, error } = await profileApi.updateAvatar(formData);
    dispatch(setLoading("REMOVE"));

    if (ok) {
      setIsOpenChangeAvatar(false);
      showSuccessModal({
        title: "Notification",
        content: "Change avatar successfully!",
        onOk: () => {},
      });
      fetchData(true);
    } else {
      handlResponseError(error);
    }
  };

  const handleUpdateUserInfo = async (data: UpdateFormProps) => {
    dispatch(setLoading("ADD"));
    const { ok, error } = await profileApi.updateUserProfile(data);
    dispatch(setLoading("REMOVE"));

    if (ok) {
      setIsOpenChageUserInfo(false);
      showSuccessModal({
        title: "Notification",
        content: "Change profile successfully!",
        onOk: () => {},
      });
      fetchData(true);
    } else {
      handlResponseError(error);
    }
  };
  const fetchData = async (isResetRedux: boolean = false) => {
    dispatch(setLoading("ADD"));
    const { ok, body, error } = await profileApi.getProfile();
    dispatch(setLoading("REMOVE"));

    if (ok && body) {
      setProfile(body);
      if (isResetRedux) {
        dispatch(updateUserProfile(body));
      }
    } else {
      handlResponseError(error);
    }
  };

  useEffectOnce(() => {
    fetchData();
  });

  useEffect(() => {
    if (isOpenChageUserInfo) {
      setValue("firstName", profile.first_name);
      setValue("lastName", profile.last_name);
      setValue("address", profile.address);
      setValue("gender", profile.gender === "Male" ? 1 : 0);
      setValue("age", profile.age);
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenChageUserInfo]);

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h3>User Profile</h3>
        <div className="flex-row items-center gap-2">
          <button onClick={() => setIsOpenChangeAvatar(true)}>
            Change avatar
          </button>
          <button onClick={() => setIsOpenChageUserInfo(true)}>
            Edit profile
          </button>
        </div>
      </div>
      <div className="profile-page__content">
        <img src={profile.avatar} alt="avatar" />
        <div className="user-info">
          <div className="flex-row items-center gap-2">
            <FaUser style={{ fontSize: "24px" }} />
            <span className="name">{`${profile.first_name} ${profile.last_name}`}</span>
          </div>
          <div className="flex-row items-center gap-2">
            <MdAlternateEmail style={{ fontSize: "24px" }} />
            <span style={{ fontSize: "16px" }}>{profile.email}</span>
          </div>
          <div className="flex-row items-center gap-2">
            <FaHome style={{ fontSize: "24px" }} />
            <span style={{ fontSize: "16px" }}>{profile.address}</span>
          </div>
          <div className="flex-row items-center gap-2">
            {profile.gender === "Male" ? (
              <FaMale style={{ fontSize: "24px" }} />
            ) : (
              <FaFemale style={{ fontSize: "24px" }} />
            )}
            <span style={{ fontSize: "16px" }}>{profile.gender}</span>
          </div>
          <div className="flex-row items-center gap-2">
            <FaBirthdayCake style={{ fontSize: "24px" }} />
            <span style={{ fontSize: "16px" }}>{profile.age}</span>
          </div>
          <div className="flex-row items-center gap-2">
            <FaFlag style={{ fontSize: "24px" }} />
            <Tag
              color={
                ["A1", "A2"].includes(profile.level)
                  ? "success"
                  : ["B1", "B2"].includes(profile.level)
                  ? "warning"
                  : "error"
              }
              style={{ fontSize: "16px", fontWeight: 600 }}
            >
              {profile.level}
            </Tag>
          </div>
        </div>
      </div>
      <div className="profile-page__description">
        <p>{profile.description || "No description"}</p>
      </div>

      <Modal
        title="Change avatar"
        open={isOpenChangeAvatar}
        centered
        onCancel={() => setIsOpenChangeAvatar(false)}
        footer={null}
        maskClosable={false}
        width={600}
        destroyOnClose
      >
        <div className="change-avatar">
          <label htmlFor="input__image">Select image</label>
          <input
            type="file"
            id="input__image"
            name="input__image"
            accept="image/*"
            ref={inputImageRef}
          />
          <div className="change-avatar__footer">
            <button onClick={handleChangeAvatar}>Save</button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Edit profile"
        open={isOpenChageUserInfo}
        centered
        onCancel={() => setIsOpenChageUserInfo(false)}
        footer={null}
        maskClosable={false}
        width={700}
        destroyOnClose
      >
        <form
          onSubmit={handleSubmit(handleUpdateUserInfo)}
          className="edit-profile"
        >
          <div className="column">
            <label htmlFor="input_first_name">First Name</label>
            <input
              id="input_first_name"
              type="text"
              placeholder="Enter your first name"
              {...register("firstName")}
            />
            {errors.firstName && (
              <span className="error">{errors.firstName.message}</span>
            )}
          </div>
          <div className="column">
            <label htmlFor="input_last_name">Last Name</label>
            <input
              id="input_last_name"
              type="text"
              placeholder="Enter your last name"
              {...register("lastName")}
            />
            {errors.lastName && (
              <span className="error">{errors.lastName.message}</span>
            )}
          </div>
          <div className="column">
            <label htmlFor="input_email">Email</label>
            <input
              id="input_email"
              name="input_email"
              type="text"
              placeholder="Enter your email"
              readOnly
              value={profile.email}
            />
          </div>
          <div className="column">
            <label htmlFor="input_address">Address</label>
            <input
              id="input_address"
              type="text"
              placeholder="Enter your address"
              {...register("address")}
            />
            {errors.address && (
              <span className="error">{errors.address.message}</span>
            )}
          </div>
          <div className="column">
            <label htmlFor="input_age">Age</label>
            <input
              id="input_age"
              type="text"
              placeholder="Enter your age"
              {...register("age")}
            />
            {errors.age && <span className="error">{errors.age.message}</span>}
          </div>
          <div className="column">
            <label htmlFor="select__age">Gender</label>
            <select id="select__age" {...register("gender")}>
              <option value={1}>Male</option>
              <option value={0}>Female</option>
            </select>
            {errors.gender && (
              <span className="error">{errors.gender.message}</span>
            )}
          </div>
          <div className="column col-span-2">
            <button type="submit">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Profile;
