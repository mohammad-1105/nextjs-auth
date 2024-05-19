import { dbConnect } from "@/lib/db/dbConnect";
import UserModel, { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/schema/loginSchema";
import { ZodError } from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import bcryptjs from "bcryptjs";
import { MongooseError } from "mongoose";
import { createSession } from "@/lib/session";

interface LoginProps {
  email: string;
  password: string;
}


export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {

  // db connect first
  await dbConnect();

  try {
    // get data from request
    const { email, password }: LoginProps = await request.json();

    // zod validation
    const { error } = loginSchema.safeParse({ email, password });
    if (error instanceof ZodError) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: error.issues[0].message,
        },
        { status: 400 }
      );
    }

    // find if the user doesn't exists
    const existingUser = await UserModel.findOne<User>({ email });
    if (!existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User doesn't exists, please signup first",
        },
        { status: 400 }
      );
    }

    // check password
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid password",
        },
        { status: 400 }
      );
    }

    // call create session function
    const { session } = await createSession(existingUser._id);

    // add and save session to db
    existingUser.sessionToken = session;
    existingUser.sessionTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hr
    await existingUser.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Login successfully",
      },
      { status: 200 }
    );
  } catch (error: any | MongooseError) {
    if (error instanceof MongooseError) {
      // Handle mongoose specific error
      console.error("Mongoose Error : ", error);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Database error occured",
        },
        { status: 500 }
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected Error:", error);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "An unexpected error occurred",
        },
        { status: 500 }
      );
    }
  }
}
