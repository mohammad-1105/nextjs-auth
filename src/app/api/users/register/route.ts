import { dbConnect } from "@/lib/db/dbConnect";
import UserModel, { User } from "@/models/user.model";
import { registerSchema } from "@/schema/registerSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import bcryptjs from "bcryptjs";
import { MongooseError } from "mongoose";

interface registerProps {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  // db connect first
  dbConnect();

  try {
    // get data from request
    const { name, email, password }: registerProps = await request.json();

    // zod validation
    const { error } = registerSchema.safeParse({ name, email, password });
    if (error instanceof ZodError) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: error.issues[0].message,
        },
        { status: 400 }
      );
    }

    // check if the user already exists
    const user = await UserModel.findOne<User>({ email });
    if (user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // create user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error: any | MongooseError) {
    if (error instanceof MongooseError) {
      // Handle Mongoose-specific errors
      console.error("Mongoose Error:", error.message);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Database error occurred",
        },
        { status: 500 }
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected Error:", error.message);
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
