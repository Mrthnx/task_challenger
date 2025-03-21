import { Request } from "express";

export interface UserRequest {
  id: number;
  email: string;
}

export interface AppRequest extends Request {
  user: UserRequest;
}
