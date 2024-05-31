import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "../consts/app";
import { UserProfileModel } from "../models/user";
import { HttpResponse } from "../models/http";
import { getLocalStorage } from "../utils/localStorage";
import axiosClient, { handleRequest } from "./axiosClient";
import { UpdateFormProps } from "../features/profile/Profile";

const profileApi = {
  getProfile: (): Promise<HttpResponse<UserProfileModel>> => {
    const url = "/api/users/profile";
    return handleRequest(
      axiosClient.get(url, {
        headers: {
          Authorization: `Bearer ${getLocalStorage(
            ACCESS_TOKEN_LOCAL_STORAGE_KEY
          )}`,
        },
      })
    );
  },
  updateAvatar: (formData: FormData): Promise<HttpResponse<unknown>> => {
    const url = "/api/users/avatar";
    return handleRequest(
      axiosClient.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getLocalStorage(
            ACCESS_TOKEN_LOCAL_STORAGE_KEY
          )}`,
        },
      })
    );
  },
  updateUserProfile: (
    body: UpdateFormProps
  ): Promise<HttpResponse<unknown>> => {
    const url = "/api/users/update";
    return handleRequest(
      axiosClient.post(url, body, {
        headers: {
          Authorization: `Bearer ${getLocalStorage(
            ACCESS_TOKEN_LOCAL_STORAGE_KEY
          )}`,
        },
      })
    );
  },
};

export default profileApi;
