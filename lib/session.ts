import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  createSessionValue,
  verifySessionValue,
  type SessionPayload,
} from "./session-core";

export async function setSessionCookie(payload: SessionPayload) {
  const value = await createSessionValue(payload);
  cookies().set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const value = cookies().get(COOKIE_NAME)?.value;
  if (!value) return null;
  return verifySessionValue(value);
}

export async function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}
