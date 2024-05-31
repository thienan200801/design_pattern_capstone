import React from "react";
import { UserModel } from "../../../models/user";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { FaBirthdayCake, FaHome } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import { useAppDispatch } from "../../../app/hooks";
import { setLoading } from "../../../redux/globalSlice";
import requestApi from "../../../api/requestApi";
import { useHandleResponseError } from "../../../hooks/useHandleResponseError";
import classNames from "classnames";
import friendApi from "../../../api/friendApi";
import { showSuccessModal } from "../../../components/modals/CommonModals";

interface UserCartProps {
  user: UserModel;
  index: number;
  statusButtons: boolean[];
  updateStatusButtons: (index: number) => void;
  type?: "SEND_CANCEL" | "ACCEPT_REJECT" | "UNFRIEND";
  afterUnfriend: () => void;
}

const UserCart: React.FunctionComponent<UserCartProps> = ({
  user,
  index,
  statusButtons,
  updateStatusButtons,
  type = "SEND_CANCEL",
  afterUnfriend,
}) => {
  const dispatch = useAppDispatch();
  const handleResponseError = useHandleResponseError();

  const handleSendClick = async (userId: number, type: "SEND" | "CANCEL") => {
    dispatch(setLoading("ADD"));
    const { error, ok } =
      type === "SEND"
        ? await requestApi.sendRequest(userId)
        : await requestApi.cancelRequestByUserId(userId);
    dispatch(setLoading("REMOVE"));

    if (ok) {
      updateStatusButtons(index);
    } else handleResponseError(error);
  };

  const handleUnfriendClick = async (id: number) => {
    dispatch(setLoading("ADD"));
    const { error, ok } = await friendApi.unfriend(id);

    if (ok) {
      afterUnfriend();
      dispatch(setLoading("REMOVE"));
    } else {
      dispatch(setLoading("REMOVE"));
      handleResponseError(error);
    }
  };

  const handleAcceptRequest = async (id: number) => {
    dispatch(setLoading("ADD"));
    const { error, ok } = await requestApi.acceptRequest(id);

    dispatch(setLoading("REMOVE"));
    if (ok) {
      showSuccessModal({
        content: "You and this user have been friends.",
        onOk: () => {},
        title: "Notification",
      });
    } else {
      handleResponseError(error);
    }
    afterUnfriend();
  };

  const handleRejectRequest = async (id: number) => {
    dispatch(setLoading("ADD"));
    const { error, ok } = await requestApi.acceptRequest(id);

    dispatch(setLoading("REMOVE"));
    if (ok) {
      showSuccessModal({
        content: "Rejected",
        onOk: () => {},
        title: "Notification",
      });
    } else {
      handleResponseError(error);
    }
    afterUnfriend();
  };

  return (
    <div className="user-cart">
      <div className="w-full">
        <div className="user-cart__header">
          <img className="avatar" src={user.avatar} />
          <div className="user-detail">
            <p className="user-name">{`${user.firstName} ${user.lastName}`}</p>
            <div className="other-infor">
              <div className="column">
                {user.gender === "Male" ? (
                  <IoMdMale className="gender-icon" />
                ) : (
                  <IoMdFemale className="gender-icon" />
                )}
                <span>{user.gender}</span>
              </div>
              <div className="column">
                <FaBirthdayCake className="gender-icon" />
                <span>{user.age}</span>
              </div>
              <div className="column">
                <FaHome className="gender-icon" />
                <span className="line-clamp-1 mw-60">{user.address}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="user-cart__level">
          <div className="column">
            <TbTargetArrow className="target-icon green" />
            <p>
              Overall <span className="data">{user.overall}</span>
            </p>
          </div>
          <div className="column">
            <TbTargetArrow className="target-icon red" />
            <p>
              Target <span className="data">{user.target}</span>
            </p>
          </div>
        </div>
        <div className="user-cart__description">
          <p>{user.description || "No description."}</p>
        </div>
      </div>
      {type === "SEND_CANCEL" && (
        <button
          className={classNames("btn-send", { sent: statusButtons[index] })}
          onClick={() =>
            handleSendClick(user.id, statusButtons[index] ? "CANCEL" : "SEND")
          }
        >
          {statusButtons[index] ? "Cancel Request" : "Send Request"}
        </button>
      )}

      {type === "UNFRIEND" && (
        <button
          className={classNames("btn-send", "sent")}
          onClick={() => handleUnfriendClick(user.id)}
        >
          Unfriend
        </button>
      )}

      {type === "ACCEPT_REJECT" && (
        <div className="handle-request">
          <button onClick={() => handleAcceptRequest(user.id)}>Accept</button>
          <button onClick={() => handleRejectRequest(user.id)}>Reject</button>
        </div>
      )}
    </div>
  );
};

export default UserCart;
