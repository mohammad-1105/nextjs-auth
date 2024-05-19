import { SessionPayload } from "@/lib/dal";
import { dbConnect } from "@/lib/db/dbConnect";
import { dcrypt, deleteSession } from "@/lib/session";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";



export async function GET(): Promise<NextResponse<ApiResponse>> {
  // db connect first
  await dbConnect();

  try {
    // Get the session from the cookie
    const session = cookies().get("session")?.value;
    if (!session) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "No session found",
        },
        { status: 401 }
      );
    }

    // dcrypt session
    const payload = (await dcrypt(session)) as SessionPayload;
    if (!payload || !payload.userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid session",
        },
        { status: 401 }
      );
    }

    // find user
    const user = await UserModel.findOne({ _id: payload.userId });
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found with session",
        },
        { status: 404 }
      );
    }
    // remove session
    user.sessionToken = undefined;
    user.sessionTokenExpiry = undefined;
    await user.save();

    // delete session from browser
    await deleteSession();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging out : ", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to logout !",
      },
      { status: 500 }
    );
  }
}
