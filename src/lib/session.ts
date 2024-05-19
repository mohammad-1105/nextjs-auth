import "server-only";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET!;

interface SessionPayload extends JwtPayload {
  userId: string;
}

// jwt encrypt function
export async function encrypt(userId: string): Promise<string> {
  return jwt.sign(
    { userId },
    secretKey,
    { expiresIn: "1h" }
  );
}

// jwt decrypt function
export async function dcrypt(session: string): Promise<SessionPayload | null> {
  if (!session) {
    console.error("No session token provided");
    return null;
  }
  
  try {
    return jwt.verify(session, secretKey) as SessionPayload;
  } catch (error) {
    console.error("JWT decrypt error:", error);
    return null;
  }
}

// create session
export async function createSession(userId: string): Promise<{ session: string }> {
  const session = await encrypt(userId);

  // set cookies
  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    maxAge: 3600, // 1 hr expiry
  });

  return { session };
}

// update session
export async function updateSession(): Promise<SessionPayload | null> {
  const sessionCookie = cookies().get("session");
  const session = sessionCookie?.value;
  if (!session) {
    console.error("No session cookie found");
    return null;
  }
  
  const payload = await dcrypt(session);
  if (!payload) {
    console.error("Invalid session payload");
    return null;
  }

  // set cookies
  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    maxAge: 3600, // 1 hr expiry
  });

  return payload;
}

// delete session
export async function deleteSession(): Promise<void> {
  cookies().delete("session");
}
