import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffectOnce } from "usehooks-ts";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectProfile,
  selectisStartedCall,
  setStartedCall,
} from "../../../redux/globalSlice";
import MeetingView from "../components/MeetingView";

interface ICallingProps {}

const Calling: React.FunctionComponent<ICallingProps> = () => {
  const profile = useAppSelector(selectProfile);
  const isStartedCall = useAppSelector(selectisStartedCall);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onLeaveCall = () => {
    dispatch(setStartedCall(null));
    navigate("/");
  };

  useEffectOnce(() => {
    if (!isStartedCall) navigate("/");
  });

  return null;
};

export default Calling;
