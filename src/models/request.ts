import { UserModel } from "./user";

export interface RequestModel {
  id: number;
  user: UserModel;
  targetUser: UserModel;
}
