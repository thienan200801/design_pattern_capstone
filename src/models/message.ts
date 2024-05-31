export interface MessageResponse {
  message: string;
  date: string;
  userId: number;
}

export interface MessageRequest {
  message: string;
  type: "JOIN" | "MESSAGE" | "LEAVE" | "CALL" | "CANCEL" | "REJECT" | "ACCEPT";
  chatroomId: number;
  userId: number;
}

export interface CallRequestResponse {
  chatroomId: number;
  name: string;
  avatar: string;
  userId: number;
  type: "JOIN" | "MESSAGE" | "LEAVE" | "CALL" | "CANCEL" | "REJECT" | "ACCEPT";
  roomId: string;
}
