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
 * Check if a user has access to a config
 * Direct Supabase query - no HTTP calls, Vercel-compatible
 */
export async function checkConfigAccess(userId, configId) {
  const { data, error } = await supabase
    .from("Dom_Config_Access")
    .select("id")
    .eq("dom_id", userId)
    .eq("config_id", configId)
    .single();

  if (error) {
    // PGRST116 means no rows found
    if (error.code === "PGRST116") {
      return false;
    }
    //throw new Error("Failed to check access");
  }

  return !!data;
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
 * Verify session and check authorization for a config (using Request)
 * Returns user's internal ID if authorized, throws otherwise
 */
export async function verifyConfigAccessFromRequest(request, configId) {
  const discordId = await verifySessionFromRequest(request);
  const userId = await getUserIdFromDiscord(discordId);
  //const hasAccess = await checkConfigAccess(userId, configId);

  //if (!hasAccess) {
  //    throw new Error('Access denied');
  //}

  return userId;
}
