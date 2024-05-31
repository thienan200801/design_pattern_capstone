import { UserModel } from "./user";

export interface FriendModel {
  id: number;
  user: UserModel;
  friend: UserModel;
}
