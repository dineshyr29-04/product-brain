"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";

export type UserRole = "pm" | "sales" | "engineering";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar?: string;
}

export const PRESET_PERSONAS: Record<UserRole, UserProfile> = {
  pm: {
    id: "pm-1",
    name: "Sarah Jenkins",
    email: "sarah.pm@productbrain.io",
    role: "pm",
    title: "Principal Product Manager (Admin)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  sales: {
    id: "sales-1",
    name: "Michael Chang",
    email: "michael.sales@productbrain.io",
    role: "sales",
    title: "VP of Enterprise Sales",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  engineering: {
    id: "eng-1",
    name: "Alex Rivera",
    email: "alex.eng@productbrain.io",
    role: "engineering",
    title: "Staff Engineering Lead",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  }
};

const DEFAULT_TEAM_MEMBERS: UserProfile[] = [
  {
    id: "mem-1",
    name: "Elena Rostova",
    email: "elena@beta.com",
    role: "sales",
    title: "Account Executive (Beta Inc)"
  },
  {
    id: "mem-2",
    name: "David Kim",
    email: "david@delta.com",
    role: "engineering",
    title: "Backend Engineer (Delta Global)"
  },
  {
    id: "mem-3",
    name: "Marcus Vance",
    email: "marcus@salesforce.com",
    role: "sales",
    title: "Senior AE — Enterprise"
  }
];

export function isUserLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("pb_session_active") === "true";
}

export function getLoggedInUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  if (localStorage.getItem("pb_session_active") !== "true") return null;
  try {
    const raw = localStorage.getItem("pb_current_user");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

export function getCurrentUser(): UserProfile {
  const user = getLoggedInUser();
  if (user) return user;
  return PRESET_PERSONAS.pm;
}

export function setCurrentUser(user: UserProfile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("pb_current_user", JSON.stringify(user));
    localStorage.setItem("pb_user_role", user.role);
    localStorage.setItem("pb_session_active", "true");
  } catch (e) {}
}

export function getCurrentRole(): UserRole {
  if (typeof window === "undefined") return "pm";
  try {
    const role = localStorage.getItem("pb_user_role") as UserRole;
    if (role && (role === "pm" || role === "sales" || role === "engineering")) {
      return role;
    }
  } catch (e) {}
  return "pm";
}

export function getTeamMembers(): UserProfile[] {
  if (typeof window === "undefined") return DEFAULT_TEAM_MEMBERS;
  try {
    const raw = localStorage.getItem("pb_team_members");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_TEAM_MEMBERS;
}

export function addTeamMember(email: string, role: "sales" | "engineering", name?: string): UserProfile {
  const members = getTeamMembers();
  const newMember: UserProfile = {
    id: `mem-${Date.now()}`,
    name: name || email.split("@")[0],
    email: email.trim().toLowerCase(),
    role,
    title: role === "sales" ? "Sales Representative" : "Software Engineer"
  };
  const updated = [newMember, ...members.filter((m) => m.email.toLowerCase() !== email.trim().toLowerCase())];
  if (typeof window !== "undefined") {
    localStorage.setItem("pb_team_members", JSON.stringify(updated));
  }
  return newMember;
}

export function removeTeamMember(id: string) {
  const members = getTeamMembers();
  const updated = members.filter((m) => m.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem("pb_team_members", JSON.stringify(updated));
  }
}

export function loginAsPersona(role: UserRole): UserProfile {
  const persona = PRESET_PERSONAS[role];
  setCurrentUser(persona);
  return persona;
}

export function loginWithCredentials(
  email: string,
  role: UserRole,
  password?: string
): { success: boolean; user?: UserProfile; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: "Please enter a valid email address." };
  }

  // 1. Product Manager Portal (Admin authority)
  if (role === "pm") {
    const user: UserProfile = {
      id: "pm-user",
      name: cleanEmail === PRESET_PERSONAS.pm.email.toLowerCase() ? PRESET_PERSONAS.pm.name : cleanEmail.split("@")[0],
      email: cleanEmail,
      role: "pm",
      title: "Product Manager (Admin)",
      avatar: PRESET_PERSONAS.pm.avatar
    };
    setCurrentUser(user);
    return { success: true, user };
  }

  // 2. Sales & Engineering Portals: Check PM Authorization
  const teamMembers = getTeamMembers();
  const preset = PRESET_PERSONAS[role];
  const isPresetMatch = preset.email.toLowerCase() === cleanEmail;
  const teamMatch = teamMembers.find(
    (m) => m.email.toLowerCase() === cleanEmail && m.role === role
  );

  if (!isPresetMatch && !teamMatch) {
    const roleName = role === "sales" ? "Sales Department" : "Engineering Team";
    return {
      success: false,
      error: `Access Denied: The Product Manager has not authorized '${email}' for ${roleName}. Contact Sarah Jenkins (PM Admin) or use an approved test account.`
    };
  }

  const user: UserProfile = teamMatch
    ? teamMatch
    : {
        id: `${role}-user`,
        name: preset.name,
        email: cleanEmail,
        role,
        title: preset.title,
        avatar: preset.avatar
      };

  setCurrentUser(user);
  return { success: true, user };
}

export function syncClerkUser(clerkUser: any, role?: UserRole): UserProfile {
  const email =
    clerkUser.primaryEmailAddress?.emailAddress ||
    clerkUser.username ||
    "user@productbrain.io";
  const name =
    clerkUser.fullName ||
    clerkUser.firstName ||
    email.split("@")[0];
  const userRole = role || getCurrentRole() || "pm";

  const user: UserProfile = {
    id: clerkUser.id || `clerk-${Date.now()}`,
    name,
    email,
    role: userRole,
    title:
      userRole === "pm"
        ? "Product Manager"
        : userRole === "sales"
        ? "Sales Representative"
        : "Software Engineer",
    avatar: clerkUser.imageUrl
  };
  setCurrentUser(user);
  return user;
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("pb_current_user");
    localStorage.removeItem("pb_user_role");
    localStorage.removeItem("pb_session_active");
  } catch (e) {}
}

/**
 * useDepartmentAuth: Hook ensuring that the user is logged in
 * AND has authorized access for the given requiredRole.
 */
export function useDepartmentAuth(requiredRole: UserRole) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded: clerkLoaded, isSignedIn: clerkSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();

  const [authState, setAuthState] = useState<{
    isLoading: boolean;
    isAuthorized: boolean;
    currentUser: UserProfile | null;
    denialReason?: string;
  }>({
    isLoading: true,
    isAuthorized: false,
    currentUser: null
  });

  useEffect(() => {
    if (!clerkLoaded) return;

    let user = getLoggedInUser();

    // If Clerk is signed in but local session is not active, sync from Clerk
    if (clerkSignedIn && clerkUser && !user) {
      const activeRole = getCurrentRole() || requiredRole;
      user = syncClerkUser(clerkUser, activeRole);
    }

    // 1. If not logged in at all, redirect to sign-in
    if (!user && !clerkSignedIn) {
      setAuthState({
        isLoading: false,
        isAuthorized: false,
        currentUser: null,
        denialReason: "Authentication required to enter this workspace."
      });
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}&role=${requiredRole}`);
      return;
    }

    const activeUser = user || getCurrentUser();

    // 2. Check Role Authorization
    // PM can view PM dashboard (and has administrative oversight)
    // Sales can ONLY view Sales
    // Engineering can ONLY view Engineering
    if (activeUser.role !== requiredRole && activeUser.role !== "pm") {
      setAuthState({
        isLoading: false,
        isAuthorized: false,
        currentUser: activeUser,
        denialReason: `Access Restricted: You are signed in as ${activeUser.name} (${
          activeUser.role === "sales" ? "Sales Department" : "Engineering Team"
        }). You do not have permissions for the ${
          requiredRole === "pm"
            ? "Product Manager Workspace"
            : requiredRole === "sales"
            ? "Sales Radar"
            : "Engineering Backlog"
        }.`
      });
      return;
    }

    setAuthState({
      isLoading: false,
      isAuthorized: true,
      currentUser: activeUser
    });
  }, [clerkLoaded, clerkSignedIn, clerkUser, pathname, requiredRole, router]);

  const handleSignOut = async () => {
    logoutUser();
    try {
      if (clerkSignedIn) {
        await signOut();
      }
    } catch (e) {}
    router.push("/sign-in");
  };

  return {
    ...authState,
    signOut: handleSignOut
  };
}
