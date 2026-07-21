import { createClient } from "@supabase/supabase-js";
import type { APIRoute } from "astro";
import { serializeForSupabase } from "../../script/serializeForSupabase";
import { verifyConfigAccessFromRequest } from "../../api/auth.js";

export const prerender = false;

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY,
);

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const idStr = url.searchParams.get("id");
    const configId = url.searchParams.get("config_id");
    
    if (!idStr) {
      return new Response(JSON.stringify({ error: "Missing id" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (!configId) {
      return new Response(JSON.stringify({ error: "Missing config_id" }), { status: 400, headers: { "Content-Type": "application/json" } });
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

    const { error } = await supabase
      .from("Rules_Groups")
      .delete()
      .eq("id", idStr);
    
    if (error) {
      console.error("RuleGroups delete error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("RuleGroups DELETE error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, config_id, ...updateData } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
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

    const serializedId = serializeForSupabase(id);
    const serializedUpdateData = serializeForSupabase(updateData);

    const { error } = await supabase
      .from("Rules_Groups")
      .update(serializedUpdateData)
      .eq("id", serializedId);
    
    if (error) {
      console.error("RuleGroups update error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("RuleGroups PUT error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id: _id, config_id, ...insertData } = body;

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

    const serializedBody = serializeForSupabase(insertData);

    const { error } = await supabase
      .from("Rules_Groups")
      .insert(serializedBody);
    
    if (error) {
      console.error("RuleGroups insert error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("RuleGroups POST error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
