import { SessionPayload } from "@/lib/dal";
import { dbConnect } from "@/lib/db/dbConnect";
import { dcrypt, deleteSession } from "@/lib/session";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE() {
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

    // find user and delete
    const deletedUser = await UserModel.findByIdAndDelete(payload.userId);
    if (!deletedUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Failed to delete user",
        },
        { status: 500 }
      );
    }

    // delete browser sessions
    await deleteSession();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Account deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account : ", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to delete account !",
      },
      { status: 500 }
    );
  }
}
