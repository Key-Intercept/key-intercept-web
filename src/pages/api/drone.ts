import { createClient } from "@supabase/supabase-js";
import type { APIRoute } from "astro";
import { serializeForSupabase } from "../../script/serializeForSupabase";
import { verifyConfigAccessFromRequest } from "../../api/auth.js";

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
  try {
    const url = new URL(request.url);
    const configId = url.searchParams.get("config");

    if (!configId) {
      return new Response(JSON.stringify({ error: "Missing config" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Verify authorization
    try {
      await verifyConfigAccessFromRequest(request, configId);
    } catch (error: any) {
      if (error.message === "Access denied") {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const serializedConfigId = serializeForSupabase(BigInt(configId));
    const { data, error } = await supabase
      .from("Drone_Config")
      .select("*")
      .eq("config_id", serializedConfigId)
      .maybeSingle();

    if (error) {
      console.error("Drone GET error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
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
        console.error("Drone insert error:", insertError);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
      }

      return Response.json(insertedData);
    }

    return Response.json(data);
  } catch (err: any) {
    console.error("Drone GET error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { config_id, ...updateData } = body;

    if (!config_id) {
      return new Response(JSON.stringify({ error: "Missing config_id" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Verify authorization
    try {
      await verifyConfigAccessFromRequest(request, config_id);
    } catch (error: any) {
      if (error.message === "Access denied") {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const serializedConfigId = serializeForSupabase(config_id);
    const serializedUpdateData = serializeForSupabase(updateData);

    const { error } = await supabase
      .from("Drone_Config")
      .update(serializedUpdateData)
      .eq("config_id", serializedConfigId);

    if (error) {
      console.error("Drone update error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("Drone PUT error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
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