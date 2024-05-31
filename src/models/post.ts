export interface PostModel {
  id: number;
  name: string;
  url: string;
  createdDate: string;
  status: "VALID" | "INVALID" | "PENDING";
  duration: number;
}
