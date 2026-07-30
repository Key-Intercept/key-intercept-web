import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import { serializeForSupabase } from '../../script/serializeForSupabase';
import { verifyConfigAccessFromRequest } from '../../api/auth.js';

export const prerender = false;

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY
);

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Verify authorization for this config
    try {
      await verifyConfigAccessFromRequest(request, id);
    } catch (error: any) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    if (updateData.rules_end) {
      updateData.rules_end = new Date(updateData.rules_end).toISOString();
    }

    const serializedId = serializeForSupabase(id);
    const serializedUpdateData = serializeForSupabase(updateData);

    const { error } = await supabase
      .from('Config')
      .update(serializedUpdateData)
      .eq('id', serializedId);

    if (error) {
      console.error('Config update error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('Config PUT error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};