import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';

export const prerender = false;

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY
);

export const DELETE: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const idStr = url.searchParams.get('id');
  if (!idStr) return new Response('Missing id', { status: 400 });

  const { error } = await supabase.from('Server_Whitelist_Items').delete().eq('id', idStr);
  if (error) return new Response(error.message, { status: 500 });
  return new Response('OK', { status: 200 });
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const { error } = await supabase.from('Server_Whitelist_Items').update(updateData).eq('id', id);
    if (error) return new Response(error.message, { status: 500 });
    return new Response('OK', { status: 200 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    const { error } = await supabase.from('Server_Whitelist_Items').insert(body);
    if (error) return new Response(error.message, { status: 500 });
    return new Response('OK', { status: 200 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};
