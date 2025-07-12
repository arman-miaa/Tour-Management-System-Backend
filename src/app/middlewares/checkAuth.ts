import { NextFunction, Request, Response } from "express";
import AppError from "../errorhelpers/appError";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";


 export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "Now Token Recieved");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      // authRotes = ["ADMIN", "SUPER_ADMIN"].includes("ADMIN")
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route");
      }
      console.log(verifiedToken);

      next();
    } catch (error) {
      next(error);
    }
  };