import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import { serializeForSupabase } from '../../script/serializeForSupabase';
import { verifyConfigAccessFromRequest } from '../../api/auth.js';

export const prerender = false;

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY
);

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const idStr = url.searchParams.get('id');
    const configId = url.searchParams.get('config_id');
    
    if (!idStr) {
      return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (!configId) {
      return new Response(JSON.stringify({ error: 'Missing config_id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Verify authorization
    try {
      await verifyConfigAccessFromRequest(request, configId);
    } catch (error: any) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const { error } = await supabase.from('Censored_Words').delete().eq('id', idStr);
    if (error) {
      console.error('Censored words delete error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('Censored words DELETE error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id: _id, config_id, ...insertData } = body;

    if (!config_id) {
      return new Response(JSON.stringify({ error: 'Missing config_id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Verify authorization
    try {
      await verifyConfigAccessFromRequest(request, config_id);
    } catch (error: any) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const serializedBody = serializeForSupabase({
      ...insertData,
      config_id,
    });

    const { error } = await supabase.from('Censored_Words').insert(serializedBody);
    if (error) {
      console.error('Censored words insert error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('Censored words POST error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
