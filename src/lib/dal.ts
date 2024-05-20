// Creating Data Access Layer (DAL)

/*
    * Next.js recommend creating a DAL to centralize your data requests and authorization logic.
    The DAL should include a function that verifies the user's session as they interact with your application. At the very least, the function should check if the session is valid, then redirect or return the user information needed to make further requests.

 */

import "server-only";
import { cookies } from "next/headers";
import { dcrypt } from "./session";
import { cache } from "react";
import { redirect } from "next/navigation";
import { JwtPayload } from "jsonwebtoken";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";

export interface SessionPayload extends JwtPayload {
  userId: string;
}

export const verfiySession = cache(async () => {
  // get session
  const session = cookies().get("session")?.value;
  const payload = (await dcrypt(session!)) as SessionPayload;

  if (!payload?.userId) redirect("/login");

  return { isAuthenticated: true, userId: payload.userId };
});

// get user
export const getUser = cache(async () => {
  const session = await verfiySession();
  if (!session) return null;

  try {
    // find user if session is available
    const user = await UserModel.findById(session.userId);
    if(!user){
      return {
        success: false,
        message: "User not found",
      }
    }
    const userWithoutPassword = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
    return {
      success: true,
      message: "user found",
      data: userWithoutPassword,
    };
  } catch (error) {
    console.error("Failed to find user from getUser func ::", error);
    return {
      success: false,
      message: "Failed to find user",
    };
  }
});
