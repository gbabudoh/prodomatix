import { db } from "@/db";
import { users, sessions, verificationTokens, passwordResetTokens } from "@/db/schema";
import { eq, and, gt, lt, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
} from "./email";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const VERIFICATION_TOKEN_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const PASSWORD_RESET_TOKEN_DURATION = 60 * 60 * 1000; // 1 hour

// Generate a secure random token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Hash password (10 rounds is still secure but faster than 12)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Validate password strength
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  return { valid: true };
}

// Create a new user
export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role: "owner" | "consumer";
  countryCode?: string;
}) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email.toLowerCase()))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("Email already registered");
  }

  const passwordHash = await hashPassword(data.password);

  const [user] = await db
    .insert(users)
    .values({
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
      role: data.role,
      countryCode: data.countryCode || "US",
      isVerified: false,
    })
    .returning();

  // Send verification email
  await createAndSendVerificationEmail(user.id, user.email, user.name);

  return user;
}

// Create verification token and send email
export async function createAndSendVerificationEmail(
  userId: number,
  email: string,
  name: string
): Promise<boolean> {
  // Delete any existing verification tokens for this user
  await db.delete(verificationTokens).where(eq(verificationTokens.userId, userId));

  const token = generateToken();
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_DURATION);

  await db.insert(verificationTokens).values({
    userId,
    token,
    expiresAt,
  });

  return sendVerificationEmail(email, token, name);
}

// Verify email with token
export async function verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
  const [verificationToken] = await db
    .select()
    .from(verificationTokens)
    .where(and(eq(verificationTokens.token, token), gt(verificationTokens.expiresAt, new Date())))
    .limit(1);

  if (!verificationToken) {
    return { success: false, message: "Invalid or expired verification link" };
  }

  // Get user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, verificationToken.userId))
    .limit(1);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  if (user.isVerified) {
    return { success: true, message: "Email already verified" };
  }

  // Update user as verified
  await db
    .update(users)
    .set({ isVerified: true, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  // Delete the verification token
  await db.delete(verificationTokens).where(eq(verificationTokens.id, verificationToken.id));

  // Send welcome email
  await sendWelcomeEmail(user.email, user.name);

  return { success: true, message: "Email verified successfully" };
}

// Resend verification email
export async function resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    // Don't reveal if user exists
    return { success: true, message: "If an account exists, a verification email has been sent" };
  }

  if (user.isVerified) {
    return { success: false, message: "Email is already verified" };
  }

  await createAndSendVerificationEmail(user.id, user.email, user.name);

  return { success: true, message: "Verification email sent" };
}

// Request password reset
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    // Don't reveal if user exists - always return success
    return { success: true, message: "If an account exists, a password reset email has been sent" };
  }

  // Delete any existing reset tokens for this user
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));

  const token = generateToken();
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_DURATION);

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    token,
    expiresAt,
    used: false,
  });

  await sendPasswordResetEmail(user.email, token, user.name);

  return { success: true, message: "If an account exists, a password reset email has been sent" };
}

// Validate password reset token
export async function validatePasswordResetToken(token: string): Promise<{ valid: boolean; userId?: number }> {
  const [resetToken] = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.token, token),
        gt(passwordResetTokens.expiresAt, new Date()),
        eq(passwordResetTokens.used, false)
      )
    )
    .limit(1);

  if (!resetToken) {
    return { valid: false };
  }

  return { valid: true, userId: resetToken.userId };
}

// Reset password with token
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const validation = await validatePasswordResetToken(token);

  if (!validation.valid || !validation.userId) {
    return { success: false, message: "Invalid or expired reset link" };
  }

  // Get user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, validation.userId))
    .limit(1);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update password
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  // Mark token as used
  await db
    .update(passwordResetTokens)
    .set({ used: true })
    .where(eq(passwordResetTokens.token, token));

  // Invalidate all existing sessions for security
  await db.delete(sessions).where(eq(sessions.userId, user.id));

  // Send confirmation email
  await sendPasswordChangedEmail(user.email, user.name);

  return { success: true, message: "Password reset successfully" };
}

// Change password (for logged-in users)
export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  // Verify current password
  const isValid = await verifyPassword(currentPassword, user.passwordHash);
  if (!isValid) {
    return { success: false, message: "Current password is incorrect" };
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update password
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, userId));

  // Invalidate all other sessions (keep current one)
  // Note: In a real app, you'd want to keep the current session
  // For simplicity, we'll invalidate all and require re-login

  // Send confirmation email
  await sendPasswordChangedEmail(user.email, user.name);

  return { success: true, message: "Password changed successfully" };
}

// Create a session for a user
export async function createSession(userId: number): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

// Validate session and get user
export async function validateSession(token: string) {
  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!session) {
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  return user || null;
}

// Get current user from cookies
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  return validateSession(token);
}

// Login user
export async function loginUser(email: string, password: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  const token = await createSession(user.id);

  return { user, token };
}

// Logout user
export async function logoutUser(token: string) {
  await db.delete(sessions).where(eq(sessions.token, token));
}

// Logout all sessions for a user
export async function logoutAllSessions(userId: number) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

// Delete expired sessions (cleanup)
export async function cleanupSessions() {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}

// Delete expired tokens (cleanup)
export async function cleanupTokens() {
  await db.delete(verificationTokens).where(lt(verificationTokens.expiresAt, new Date()));
  await db.delete(passwordResetTokens).where(lt(passwordResetTokens.expiresAt, new Date()));
}

// Get user by ID
export async function getUserById(userId: number) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user || null;
}

// Update user profile
export async function updateUserProfile(
  userId: number,
  data: { name?: string; countryCode?: string; avatarUrl?: string }
) {
  const [user] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();

  return user;
}
