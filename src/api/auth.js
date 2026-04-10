import supabase from './supabase.js';

/**
 * Verify a session token from the Authorization header
 * Direct Supabase query - no HTTP calls, Vercel-compatible
 */
export async function verifySessionToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No authorization token provided');
    }

    const sessionToken = authHeader.split(' ')[1];

    const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('discord_id, expires_at')
        .eq('token', sessionToken)
        .single();

    if (sessionError) {
        throw new Error('Invalid session token');
    }

    if (!session) {
        throw new Error('Session not found');
    }

    if (new Date(session.expires_at) < new Date()) {
        await supabase.from('sessions').delete().eq('token', sessionToken);
        throw new Error('Session expired');
    }

    return session.discord_id;
}

/**
 * Get internal user ID from Discord ID
 * Direct Supabase query - no HTTP calls, Vercel-compatible
 */
export async function getUserIdFromDiscord(discordId) {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('discord_id', discordId)
        .single();

    if (error || !profile) {
        throw new Error('User profile not found');
    }

    return profile.id;
}

/**
 * Check if a user has access to a config
 * Direct Supabase query - no HTTP calls, Vercel-compatible
 */
export async function checkConfigAccess(userId, configId) {
    const { data, error } = await supabase
        .from('Dom_Config_Access')
        .select('id')
        .eq('dom_id', userId)
        .eq('config_id', configId)
        .single();

    if (error) {
        // PGRST116 means no rows found
        if (error.code === 'PGRST116') {
            return false;
        }
        throw new Error('Failed to check access');
    }

    return !!data;
}
