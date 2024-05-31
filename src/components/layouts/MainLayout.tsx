import { MeetingProvider } from "@videosdk.live/react-sdk";
import classNames from "classnames";
import React, { Fragment, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { MdCall } from "react-icons/md";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import { Frame } from "stompjs";
import { useEffectOnce } from "usehooks-ts";
import authApi from "../../api/authApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import MeetingView from "../../features/calling/components/MeetingView";
import { useHandleResponseError } from "../../hooks/useHandleResponseError";
import useProtectedRoute from "../../hooks/useProtectedRoute";
import { CallRequestResponse } from "../../models/message";
import {
  selectCallNotifcation,
  selectProfile,
  selectUserId,
  selectisStartedCall,
  setCallNotification,
  setLoading,
  setRequestToCall,
  setStartedCall,
  updateUserProfile,
} from "../../redux/globalSlice";
import { Header, Sidebar } from "../commons";
import { showInfoModal } from "../modals/CommonModals";
import stompClient from "../socket/stompClient";

interface MainLayoutProps {}

const MainLayout: React.FunctionComponent<MainLayoutProps> = () => {
  useProtectedRoute();
  const dispatch = useAppDispatch();
  const handleResponseError = useHandleResponseError();
  const navigate = useNavigate();
  const userId = useAppSelector(selectUserId);
  const profile = useAppSelector(selectProfile);
  const callNotification = useAppSelector(selectCallNotifcation);
  const isStartedCall = useAppSelector(selectisStartedCall);

  const handleRejectCall = () => {
    dispatch(setCallNotification(null));
    stompClient.send({
      chatroomId: callNotification?.chatroomId || 0,
      message: "",
      type: "REJECT",
      userId,
    });
  };

  const handleAcceptCall = () => {
    stompClient.send({
      chatroomId: callNotification?.chatroomId || 0,
      message: "",
      type: "ACCEPT",
      userId,
    });
  };

  const onLeaveCall = () => {
    dispatch(setStartedCall(null));
  };

  const fetchData = async () => {
    dispatch(setLoading("ADD"));

    const { ok, body, error } = await authApi.getProfile();
    if (ok && body) {
      dispatch(updateUserProfile(body));
      dispatch(setLoading("REMOVE"));
      if (body.level === "ENTRY_TEST") {
        showInfoModal({
          title: "Notification",
          content:
            "You must take a test to determine your English proficiency level before accessing this feature.",
          onOk: () => {
            navigate("/entry-test");
          },
        });
      }
      return;
    }

    dispatch(setLoading("REMOVE"));
    handleResponseError(error);
  };

  useEffectOnce(() => {
    fetchData();

    stompClient.connect(
      "http://localhost:8080/ws",
      () => {
        console.log("Websocket connected");
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      stompClient.disconnect();
    };
  });

  useEffect(() => {
    if (profile) {
      stompClient.subcribe(
        `/user/${profile.id}/notification`,
        (response: Frame) => {
          const message: CallRequestResponse = JSON.parse(response.body);
          if (message.type === "CALL") dispatch(setCallNotification(message));
          else if (message.type === "CANCEL")
            dispatch(setCallNotification(null));
          else if (message.type === "REJECT") {
            dispatch(setRequestToCall(null));
          } else if (message.type === "ACCEPT") {
            dispatch(setCallNotification(null));
            dispatch(setRequestToCall(null));
            dispatch(setStartedCall(message.roomId));
          }
        }
      );
    }
    return () => {
      stompClient.ubsubcribe(`/user/${profile?.id || 0}/notification`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  return (
    <Fragment>
      <div className="main-layout">
        <Header />
        <Sidebar />
        <Outlet />
      </div>
      <div
        className={classNames("overlay-call-notification", {
          show: callNotification,
        })}
      >
        {callNotification && !isStartedCall && (
          <div className="modal-call-notification">
            <img src={callNotification.avatar} />
            <span className="name">{callNotification.name}</span>
            <span className="calling-label">send request to call...</span>
            <div className="modal-call-notification__footer">
              <button className="btn-accept" onClick={handleAcceptCall}>
                <MdCall />
              </button>
              <button className="btn-cancel" onClick={handleRejectCall}>
                <FaXmark />
              </button>
            </div>
          </div>
        )}
      </div>
      {isStartedCall && (
        <MeetingProvider
          config={{
            meetingId: isStartedCall,
            micEnabled: true,
            webcamEnabled: true,
            name: `${profile?.first_name || ""} ${profile?.last_name || ""}`,
            participantId: `${profile?.id || 0}`,
            multiStream: true,
            mode: "CONFERENCE", // "CONFERENCE" || "VIEWER"
            metaData: {},
          }}
          token={profile?.token || ""}
          joinWithoutUserInteraction // Boolean
        >
          <MeetingView onMeetingLeave={onLeaveCall} />
        </MeetingProvider>
      )}
    </Fragment>
  );
};

export default MainLayout;
