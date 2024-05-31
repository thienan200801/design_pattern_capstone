export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  age: number;
  description: string;
  avatar: string;
  status: "ACTIVE" | "BLOCKED";
  role: "ADMIN" | "USER";
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
}

export interface UserProfileModel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  gender: string;
  age: number;
  description: string;
  avatar: string;
  token: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "ENTRY_TEST";
}
