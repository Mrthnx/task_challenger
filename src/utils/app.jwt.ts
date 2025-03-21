import { sign, verify } from "jsonwebtoken";
import { ENV } from "../config/environment";

export const signToken = (payload: Object) => {
  return sign(payload, ENV.APP.JWT_SECRET, {
    expiresIn: +ENV.APP.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string) => {
  return verify(token, ENV.APP.JWT_SECRET);
};
