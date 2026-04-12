import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
export const prerender = false;
export async function POST({ request }) {
    const supabase = createClient(
        import.meta.env.SUPABASE_URL,
        import.meta.env.SUPABASE_SERVICE_KEY
    );

    let body;
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { code } = body;

    if (!code) {
        return new Response(JSON.stringify({ error: 'No code provided' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Exchange the code for an access_token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: import.meta.env.DISCORD_CLIENT_ID,
                client_secret: import.meta.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: import.meta.env.REDIRECT_URI,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error("Discord Error Details:", JSON.stringify(tokenData, null, 2));
            return new Response(
                JSON.stringify({
                    error: "Discord refused the code",
                    details: tokenData
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        if (tokenData.error) {
            return new Response(JSON.stringify({ error: tokenData }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Use the access_token to get user info
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const userData = await userResponse.json();

        if (!userData.id) {
            return new Response(
                JSON.stringify({ error: 'Failed to get user data from Discord' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Create a secure session token
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Store session in database (upsert to handle re-logins)
        const { error: sessionError } = await supabase
            .from('sessions')
            .upsert({
                discord_id: userData.id,
                token: sessionToken,
                expires_at: expiresAt.toISOString(),
            });

        if (sessionError) {
            console.error('Session creation failed:', sessionError);
            return new Response(JSON.stringify({ error: 'Failed to create session' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Return the session token and user info
        return new Response(
            JSON.stringify({
                session_token: sessionToken,
                user: {
                    id: userData.id,
                },
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
