export async function verifySessionToken(authHeader) {
    console.log('[auth] Verifying session token, header present:', !!authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No authorization token provided');
    }

    const sessionToken = authHeader.split(' ')[1];
    console.log('[auth] Session token:', sessionToken.substring(0, 10) + '...');

    const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('discord_id, expires_at')
        .eq('token', sessionToken)
        .single();

    if (sessionError) {
        console.error('[auth] Session query error:', sessionError);
        throw new Error('Invalid session token');
    }

    if (!session) {
        console.log('[auth] No session found for token');
        throw new Error('Session not found');
    }

    if (new Date(session.expires_at) < new Date()) {
        console.log('[auth] Session expired');
        await supabase.from('sessions').delete().eq('token', sessionToken);
        throw new Error('Session expired');
    }

    console.log('[auth] Session verified for discord_id:', session.discord_id);
    return session.discord_id;
}