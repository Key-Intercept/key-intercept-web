import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY,
);

/**
 * Verify session token from Authorization header OR cookie
 * Direct Supabase query - no HTTP calls, Vercel-compatible
 */
export async function verifySessionToken(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No authorization token provided");
  }

  const sessionToken = authHeader.split(" ")[1];

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("discord_id, expires_at")
    .eq("token", sessionToken)
    .single();

  if (sessionError) {
    throw new Error("Invalid session token");
  }

  if (!session) {
    throw new Error("Session not found");
  }

  if (new Date(session.expires_at) < new Date()) {
    await supabase.from("sessions").delete().eq("token", sessionToken);
    throw new Error("Session expired");
  }

  return session.discord_id;
}

/**
 * Extract session token from cookie header string
 */
export function getSessionTokenFromCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/ki-session=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Verify session using cookie (for API routes)
 * Throws if invalid or expired
 */
export async function verifySessionFromRequest(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionToken = getSessionTokenFromCookie(cookieHeader);

  if (!sessionToken) {
    throw new Error("No session found");
  }

  return await verifySessionToken(`Bearer ${sessionToken}`);
}

/**
 * Get internal user ID from Discord ID
 * Direct Supabase query - no HTTP calls, Vercel-compatible
 */
export async function getUserIdFromDiscord(discordId) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("discord_id", discordId)
    .single();

  if (error || !profile) {
    throw new Error("User profile not found");
  }

  return profile.id;
}

/**
 * Verify session from request for API routes.
 * Keep second arg for backward-compatible call sites.
 */
export async function verifyConfigAccessFromRequest(request, _configId) {
  return await verifySessionFromRequest(request);
}
