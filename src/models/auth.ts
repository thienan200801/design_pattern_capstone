export interface LoginResponseModel {
  id: number;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequestModel {
  email: string;
  password: string;
}

export interface RegisterRequestModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  gender: number;
  age: number;
}

export interface UserProfileModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  gender: string;
  age: number;
  description: string;
  avatar: string;
  token: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
}
