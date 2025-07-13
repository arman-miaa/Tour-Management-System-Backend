/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs from "bcrypt";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";

import { generateToken, verifyToken } from "../../utils/jwt";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import AppError from "../../errorhelpers/appError";
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }


  const userTokens = createUserToken(isUserExist)

  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken:userTokens.refreshToken,
    user: rest,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

  return {
    accessToken: newAccessToken,
  };
};

//user - login - token (email, role, _id) - booking / payment / booking / payment cancel - token

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
};
