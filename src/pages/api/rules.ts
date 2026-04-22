import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import { serializeForSupabase } from '../../script/serializeForSupabase';

export const prerender = false;

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY
);

export const DELETE: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const idStr = url.searchParams.get('id');
  if (!idStr) return new Response('Missing id', { status: 400 });

  const { error } = await supabase.from('Rules').delete().eq('id', idStr);
  if (error) return new Response(error.message, { status: 500 });
  return new Response('OK', { status: 200 });
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    // Convert regex back to string for DB
    if (updateData.rule_regex && updateData.rule_regex.source) {
      updateData.rule_regex = updateData.rule_regex.source;
    }

    const serializedId = serializeForSupabase(id);
    const serializedUpdateData = serializeForSupabase(updateData);
    
    const { error } = await supabase
      .from('Rules')
      .update(serializedUpdateData)
      .eq('id', serializedId);
    if (error) return new Response(error.message, { status: 500 });
    return new Response('OK', { status: 200 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Convert regex back to string for DB
    if (body.rule_regex && body.rule_regex.source) {
      body.rule_regex = body.rule_regex.source;
    }

    const serializedBody = serializeForSupabase(body);
    
    const { error } = await supabase.from('Rules').insert(serializedBody);
    if (error) return new Response(error.message, { status: 500 });
    return new Response('OK', { status: 200 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};
