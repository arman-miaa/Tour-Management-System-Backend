/* eslint-disable @typescript-eslint/no-unused-vars */
import {  NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

// import AppError from "../../errorhelpers/appError";



// const createUser = async (req: Request, res: Response, next: nextFunction) => {
//     try {
//         // throw new Error ("Fake error")
//         // throw new AppError(httpStatus.BAD_REQUEST, "fake error")
//   const user = await UserServices.createUser(req.body)
//         res.status(httpStatus.CREATED).json({
//             message: "User Created Successfully",
//             user
           
//         })
//     } catch (error:any) {
//         // console.log(error);
//       next(error)
//     }
const createUser = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const user = await UserServices.createUser(req.body);

//   res.status(httpStatus.CREATED).json({
//     message: "User Created Successfully",
//     user,
    //   });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user
    })
});

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  // const token = req.headers.authorization;
  // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
  const verifiedToken = req.user;
  const payload = req.body;
  const user = await UserServices.updateUser(userId,payload,verifiedToken as JwtPayload) ;

//   res.status(httpStatus.CREATED).json({
//     message: "User Created Successfully",
//     user,
    //   });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user
    })
});




const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    //     res.status(httpStatus.OK).json({
    //         success: true,
    //         message: "All Users Retrieved Successfully",
    //         date: users
        // })
            sendResponse(res, {
              success: true,
              statusCode: httpStatus.CREATED,
              message: "All Users Retrieved Successfully",
                data: result.data,
              meta: result.meta
            });
  }
);

// function => req-res function

export const UserControllers = {
    createUser,
  getAllUsers,
    updateUser,
}

// route matching -> controller -> service -> mdole  -> DB