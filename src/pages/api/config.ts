import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import { serializeForSupabase } from '../../script/serializeForSupabase';

export const prerender = false;

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY
);

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (updateData.rules_end) {
      updateData.rules_end = new Date(updateData.rules_end).toISOString();
    }

    const serializedId = serializeForSupabase(id);
    const serializedUpdateData = serializeForSupabase(updateData);

    const { error } = await supabase
      .from('Config')
      .update(serializedUpdateData)
      .eq('id', serializedId);

    if (error) return new Response(error.message, { status: 500 });
    return new Response('OK', { status: 200 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};