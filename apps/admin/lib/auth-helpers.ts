import { auth, ExtendedUser } from "@admin/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

type Role = "ADMIN" | "EDITOR" | "VIEWER";

/**
 * Require authentication - redirects to login if no session
 * Use this in protected Server Components
 *
 * @returns Session (never null - redirects if no session)
 */

export async function checkUserSession(): Promise<Session> {
  const session = await auth();

  if (!session) redirect("/login");

  return session;
}

/**
 * Get session without requiring it
 * Used for pages that work with or without auth
 *
 * @returns Session | null
 */
export async function getSessionOrNull(): Promise<Session | null> {
  return await auth();
}

/**
 * Require minimum role level
 * Redirects if user doesn't have sufficient permissions
 *
 * @param minRole - Minimum required role
 * @returns Session
 */

export async function requireRole(minRole: Role): Promise<Session> {
  const session = await checkUserSession();

  const roleHierarchy: Record<Role, number> = {
    ADMIN: 3,
    EDITOR: 2,
    VIEWER: 1,
  };

  if (roleHierarchy[session.activeRole] < roleHierarchy[minRole]) {
    return redirect("/unauthorized");
  }

  return session;
}

/**
 * Get user from session
 * Convenience helper to extract user info
 */

export async function getUser(): Promise<ExtendedUser> {
  const session = await checkUserSession();

  return session.user;
}

/**
 * Check if a user has a specific role (boolean return, no redirect)
 * Useful for conditional rendering
 */

export async function hasRole(role: Role) {
  const roleHierarchy: Record<Role, number> = {
    ADMIN: 3,
    EDITOR: 2,
    VIEWER: 1,
  };
  const session = await auth();

  if (!session) return false;

  if (roleHierarchy[session.activeRole] >= roleHierarchy[role]) {
    return true;
  }
}
