import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "../consts/app";
import { BaseRequestQueryParam, HttpResponse } from "../models/http";
import { MessageResponse } from "../models/message";
import { getLocalStorage } from "../utils/localStorage";
import axiosClient, { handleRequest } from "./axiosClient";

const messageApi = {
  getMessages: (
    params: BaseRequestQueryParam,
    chatroomId: number
  ): Promise<HttpResponse<MessageResponse[]>> => {
    const url = `/api/messages/${chatroomId}`;
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
};

export default messageApi;
