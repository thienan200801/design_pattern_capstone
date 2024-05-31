import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "../consts/app";
import { BaseRequestQueryParam, HttpResponse } from "../models/http";
import { RequestModel } from "../models/request";
import { getLocalStorage } from "../utils/localStorage";
import axiosClient, { handleRequest } from "./axiosClient";

const requestApi = {
  sendRequest: (userId: number): Promise<HttpResponse<unknown>> => {
    const url = "/api/requests";
    return handleRequest(
      axiosClient.post(
        url,
        {
          targetUserId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${getLocalStorage(
              ACCESS_TOKEN_LOCAL_STORAGE_KEY
            )}`,
          },
        }
      )
    );
  },
  cancelRequestByUserId: (userId: number): Promise<HttpResponse<unknown>> => {
    const url = `/api/requests/user/${userId}`;
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
  getRequests: (
    params: BaseRequestQueryParam
  ): Promise<HttpResponse<RequestModel[]>> => {
    const url = "/api/requests";
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
  getSentRequests: (
    params: BaseRequestQueryParam
  ): Promise<HttpResponse<RequestModel[]>> => {
    const url = "/api/requests/sent";
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
  getReceivedRequests: (
    params: BaseRequestQueryParam
  ): Promise<HttpResponse<RequestModel[]>> => {
    const url = "/api/requests/received";
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
  acceptRequest: (userId: number): Promise<HttpResponse<unknown>> => {
    const url = `/api/requests/accept/${userId}`;
    return handleRequest(
      axiosClient.post(url, null, {
        headers: {
          Authorization: `Bearer ${getLocalStorage(
            ACCESS_TOKEN_LOCAL_STORAGE_KEY
          )}`,
        },
      })
    );
  },
  rejectRequest: (userId: number): Promise<HttpResponse<unknown>> => {
    const url = `/api/requests/reject/${userId}`;
    return handleRequest(
      axiosClient.post(url, null, {
        headers: {
          Authorization: `Bearer ${getLocalStorage(
            ACCESS_TOKEN_LOCAL_STORAGE_KEY
          )}`,
        },
      })
    );
  },
};

export default requestApi;
