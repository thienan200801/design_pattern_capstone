import { useNavigate } from "react-router-dom";
import { useEffectOnce } from "usehooks-ts";
import {
  ACCESS_TOKEN_LOCAL_STORAGE_KEY,
  USER_ID_LOCAL_STORAGE_KEY,
} from "../consts/app";
import { getLocalStorage } from "../utils/localStorage";
import { useAppDispatch } from "../app/hooks";
import { updateUserId } from "../redux/globalSlice";

const useProtectedRoute = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffectOnce(() => {
    if (!getLocalStorage(ACCESS_TOKEN_LOCAL_STORAGE_KEY)) navigate("/login");
    else {
      const userId = Number(getLocalStorage(USER_ID_LOCAL_STORAGE_KEY));
      dispatch(updateUserId(userId));
    }
  });
};

export default useProtectedRoute;
