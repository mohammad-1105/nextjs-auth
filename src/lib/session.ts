import "server-only"
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const secretKey: string = process.env.SESSION_SECRET!;

// jwt encryt function
export async function encrypt(userId: string) {
  return jwt.sign(
    {
      userId: userId,
    },
    secretKey,
    { expiresIn: "1h" }
  );
}

// jwt dcrypt function
export async function dcrypt(session: string) {
  try {
    return jwt.verify(session, secretKey);
  } catch (error) {
    console.error("jwt dcrpyt error :: " , error)
  }
  
}

// create session
export async function createSession(userId: string) {
  const session: string = await encrypt(userId);

  // set cookies
  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    maxAge: 3600, // 1 hr expiry
  });

  return {session};
}

// update session
export async function updateSession() {
  const session: string = cookies().get("session")?.value || "";
  const payload = await dcrypt(session);
  if (!payload || !session) {
    return null;
  }

  // set cookies
  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    maxAge: 3600, // 1 hr expiry
    
  });
}

// delete session
export async function deleteSession() {
  // delete cookies
  cookies().delete("session");
}
