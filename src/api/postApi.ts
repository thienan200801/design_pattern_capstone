import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "../consts/app";
import { BaseRequestQueryParam, HttpResponse } from "../models/http";
import { PostModel } from "../models/post";
import { getLocalStorage } from "../utils/localStorage";
import axiosClient, { handleRequest } from "./axiosClient";

const postApi = {
  getPosts: (
    params: BaseRequestQueryParam
  ): Promise<HttpResponse<PostModel[]>> => {
    const url = "/api/posts";
    return handleRequest(
      axiosClient.get(url, {
        params,
        headers: {
          Authorization: `Bearer ${getLocalStorage(
            ACCESS_TOKEN_LOCAL_STORAGE_KEY
          )}`,
        },
      })
    );
  },
  uploadVideo: (formData: FormData): Promise<HttpResponse<unknown>> => {
    const url = "/api/posts";
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
};

export default postApi;
