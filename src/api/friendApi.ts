import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "../consts/app";
import { FriendModel } from "../models/friend";
import { BaseRequestQueryParam, HttpResponse } from "../models/http";
import { getLocalStorage } from "../utils/localStorage";
import axiosClient, { handleRequest } from "./axiosClient";

const friendApi = {
  getFriends: (
    params: BaseRequestQueryParam
  ): Promise<HttpResponse<FriendModel[]>> => {
    const url = "/api/friends";
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
  unfriend: (id: number): Promise<HttpResponse<unknown>> => {
    const url = `/api/friends/${id}`;
    return handleRequest(
      axiosClient.delete(url, {
        headers: {
          Authorization: `Bearer ${getLocalStorage(
            ACCESS_TOKEN_LOCAL_STORAGE_KEY
          )}`,
        },
      })
    );
  },
};

export default friendApi;
