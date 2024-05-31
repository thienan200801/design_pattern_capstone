import React, { useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import Controls from "./Controls";
import ParticipantView from "./ParticipantView";
import classNames from "classnames";
import { useAppSelector } from "../../../app/hooks";
import { selectisStartedCall } from "../../../redux/globalSlice";

interface MeetingViewProps {
  onMeetingLeave: () => void;
}

const MeetingView: React.FunctionComponent<MeetingViewProps> = ({
  onMeetingLeave,
}) => {
  const isStartedCall = useAppSelector(selectisStartedCall);
  const [joined, setJoined] = useState<string | null>(null);
  const { participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      onMeetingLeave();
    },
  });

  return (
    <div className={classNames("overlay-calling", { show: isStartedCall })}>
      <Controls />
      <div className="calling">
        {[...participants.keys()].map((participantId) => (
          <ParticipantView participantId={participantId} key={participantId} />
        ))}
      </div>
    </div>
  );
};

export default MeetingView;
