import { createClient } from "@supabase/supabase-js";
import type { APIRoute } from "astro";
import { serializeForSupabase } from "../../script/serializeForSupabase";

export const prerender = false;

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY
);

const droneConfigDefaults = {
  drone_health: 100,
  speech_header: "",
  speech_footer: "",
  action_header: "",
  action_footer: "",
  whisper_header: "",
  whisper_footer: "",
  loud_header: "",
  loud_footer: "",
};

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const configId = url.searchParams.get("config");

  if (!configId) {
    return new Response("Missing config", { status: 400 });
  }

  const serializedConfigId = serializeForSupabase(BigInt(configId));
  const { data, error } = await supabase
    .from("Drone_Config")
    .select("*")
    .eq("config_id", serializedConfigId)
    .maybeSingle();

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  if (!data) {
    const insertData = serializeForSupabase({
      config_id: serializedConfigId,
      ...droneConfigDefaults,
    });

    const { data: insertedData, error: insertError } = await supabase
      .from("Drone_Config")
      .insert(insertData)
      .select("*")
      .single();

    if (insertError) {
      return new Response(insertError.message, { status: 500 });
    }

    return Response.json(insertedData);
  }

  return Response.json(data);
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { config_id, ...updateData } = body;
    const serializedConfigId = serializeForSupabase(config_id);
    const serializedUpdateData = serializeForSupabase(updateData);

    const { error } = await supabase
      .from("Drone_Config")
      .update(serializedUpdateData)
      .eq("config_id", serializedConfigId);

    if (error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const serializedBody = serializeForSupabase(body);

    const { error } = await supabase.from("Drone_Config").insert(serializedBody);
    if (error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};