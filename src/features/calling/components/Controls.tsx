import React from "react";
import { MdCall } from "react-icons/md";
import { useMeeting } from "@videosdk.live/react-sdk";
import { BsMicMuteFill, BsMicFill } from "react-icons/bs";
import { HiMiniVideoCamera, HiMiniVideoCameraSlash } from "react-icons/hi2";
import classNames from "classnames";

interface ControlsProps {}

const Controls: React.FunctionComponent<ControlsProps> = () => {
  const { leave, toggleMic, toggleWebcam, localMicOn, localWebcamOn } =
    useMeeting();

  return (
    <div className="calling-controls">
      <button
        className={classNames("toggle", { muted: !localMicOn })}
        onClick={() => toggleMic()}
      >
        {localMicOn ? <BsMicFill /> : <BsMicMuteFill />}
      </button>
      <button
        className={classNames("toggle", { muted: !localMicOn })}
        onClick={() => toggleWebcam()}
      >
        {localWebcamOn ? <HiMiniVideoCamera /> : <HiMiniVideoCameraSlash />}
      </button>
      <button className="leave-call" onClick={() => leave()}>
        <MdCall />
      </button>
    </div>
  );
};

export default Controls;
