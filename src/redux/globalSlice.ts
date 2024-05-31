import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { UserProfileModel } from "../models/user";
import { removeLocalStorage } from "../utils/localStorage";
import {
  ACCESS_TOKEN_LOCAL_STORAGE_KEY,
  USER_ID_LOCAL_STORAGE_KEY,
} from "../consts/app";
import { CallRequestResponse } from "../models/message";

export interface RequestToCallProps {
  userId: number;
  chatroomId: number;
  name: string;
  avatar: string;
  mic: boolean;
  camera: boolean;
}

interface InitialStateProps {
  userId: number;
  loading: number;
  profile: UserProfileModel | null;
  requestToCall: RequestToCallProps | null;
  callNotification: CallRequestResponse | null;
  isStartedCall: string | null;
}

const initialState: InitialStateProps = {
  userId: -1,
  loading: 0,
  profile: null,
  requestToCall: null,
  callNotification: null,
  isStartedCall: null,
};

const globalSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    updateUserId: (state, action: PayloadAction<number>) => {
      state.userId = action.payload;
    },
    setLoading: (state, action: PayloadAction<"ADD" | "REMOVE">) => {
      switch (action.payload) {
        case "ADD":
          state.loading++;
          break;
        case "REMOVE":
          state.loading--;
          break;
        default:
          break;
      }
    },
    updateUserProfile: (
      state,
      action: PayloadAction<UserProfileModel | null>
    ) => {
      state.profile = action.payload;
    },
    logout: (state) => {
      state.profile = null;
      removeLocalStorage(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
      removeLocalStorage(USER_ID_LOCAL_STORAGE_KEY);
    },
    setRequestToCall: (
      state,
      action: PayloadAction<RequestToCallProps | null>
    ) => {
      state.requestToCall = action.payload;
    },
    toggleMicCall: (state, action: PayloadAction<boolean>) => {
      if (state.requestToCall) {
        state.requestToCall.mic = action.payload;
      }
    },
    toggleCameraCall: (state, action: PayloadAction<boolean>) => {
      if (state.requestToCall) {
        state.requestToCall.camera = action.payload;
      }
    },
    setCallNotification: (
      state,
      action: PayloadAction<CallRequestResponse | null>
    ) => {
      state.callNotification = action.payload;
    },
    setStartedCall: (state, action: PayloadAction<string | null>) => {
      state.isStartedCall = action.payload;
    },
  },
});

export const {
  updateUserId,
  setLoading,
  updateUserProfile,
  logout,
  setRequestToCall,
  toggleCameraCall,
  toggleMicCall,
  setCallNotification,
  setStartedCall,
} = globalSlice.actions;

// NOTE: Selectors
export const selectUserId = (state: RootState) => state.global.userId;
export const selectLoading = (state: RootState) => state.global.loading;
export const selectProfile = (state: RootState) => state.global.profile;
export const selectRequestToCall = (state: RootState) =>
  state.global.requestToCall;
export const selectCallNotifcation = (state: RootState) =>
  state.global.callNotification;
export const selectisStartedCall = (state: RootState) =>
  state.global.isStartedCall;

// NOTE: Reducer
const globalReducer = globalSlice.reducer;

export default globalReducer;
