import classNames from "classnames";
import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { MdArrowBack, MdCall } from "react-icons/md";
import { Frame } from "stompjs";
import { useEffectOnce } from "usehooks-ts";
import { useAppSelector } from "../../../app/hooks";
import stompClient from "../../../components/socket/stompClient";
import { MessageResponse } from "../../../models/message";
import { UserModel } from "../../../models/user";
import {
  selectUserId,
  setLoading,
  setRequestToCall,
} from "../../../redux/globalSlice";
import moment from "moment";
import { useAppDispatch } from "../../../app/hooks";
import { useHandleResponseError } from "../../../hooks/useHandleResponseError";
import messageApi from "../../../api/messageApi";

interface ChatBoxProps {
  onCloseChatBox: () => void;
  user: UserModel;
  chatroomId: number;
}

const ChatBox: React.FunctionComponent<ChatBoxProps> = ({
  onCloseChatBox,
  user,
  chatroomId,
}) => {
  const dispatch = useAppDispatch();
  const handleResponseError = useHandleResponseError();
  const userId = useAppSelector(selectUserId);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (!message) return;

    stompClient.send({
      chatroomId,
      message,
      type: "MESSAGE",
      userId,
    });
    setMessage("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendRequestCall = () => {
    dispatch(
      setRequestToCall({
        chatroomId,
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.avatar,
        mic: false,
        camera: false,
        userId,
      })
    );

    stompClient.send({
      chatroomId,
      message: "",
      type: "CALL",
      userId,
    });
  };

  const fetchData = async () => {
    dispatch(setLoading("ADD"));
    const { ok, body, error } = await messageApi.getMessages(
      { size: 30, page: 0 },
      chatroomId
    );
    dispatch(setLoading("REMOVE"));

    if (ok && body) {
      setMessages(body);
      return;
    }

    handleResponseError(error);
  };

  useEffectOnce(() => {
    fetchData();
    stompClient.subcribe(`/user/${chatroomId}/private`, (response: Frame) => {
      const message: MessageResponse = JSON.parse(response.body);
      setMessages((prev) => {
        const temp = [...prev];
        temp.push(message);
        return temp;
      });
    });

    return () => {
      stompClient.ubsubcribe(`/user/${chatroomId}/private`);
    };
  });

  return (
    <div className="chatbox">
      <div className="chatbox__header">
        <MdArrowBack className="icon" onClick={onCloseChatBox} />
        <span className="name">{`${user.firstName} ${user.lastName}`}</span>
        <MdCall className="icon" onClick={handleSendRequestCall} />
      </div>
      <div className="chatbox__content">
        {messages.map((m, index) => (
          <div
            key={`message-${index}`}
            className={classNames("message", {
              left: m.userId === userId,
            })}
          >
            <span className="date">{moment(m.date).fromNow()}</span>
            <p className="body">{m.message}</p>
          </div>
        ))}
      </div>
      <div className="chatbox__footer">
        <input
          type="text"
          placeholder="Aa"
          id="input-message"
          className="input-message"
          value={message}
          onChange={onChange}
          autoComplete="off"
          onKeyUp={handleKeyPress}
        />
        <button className="btn-send" type="button" onClick={handleSendMessage}>
          <IoMdSend className="icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
