
import { SignJWT, type JWTPayload } from "jose";

export async function signReviewPayload(payload: JWTPayload) {
  const secret = new TextEncoder().encode(
    process.env.SYNDICATION_SECRET || "default-secret-change-me"
  );

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Token valid for 24h
    .sign(secret);

  return jwt;
}
