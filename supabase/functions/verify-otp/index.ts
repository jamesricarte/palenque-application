// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

const enc = new TextEncoder();

// Cache HMAC key (same as generate-otp)
const HMAC_KEY = await crypto.subtle.importKey(
  "raw",
  enc.encode(Deno.env.get("OTP_PEPPER")!),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign"],
);

const hex = (buf: ArrayBuffer) => {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const otpHash = async (otp: string, phone: string) => {
  const sig = await crypto.subtle.sign(
    "HMAC",
    HMAC_KEY,
    enc.encode(`${phone}:${otp}`),
  );
  return hex(sig);
};

// (Optional) reduce timing leak a bit vs plain ===
const constantTimeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
};

Deno.serve(async (req) => {
  try {
    const { phone, otp } = await req.json();

    if (!phone) {
      return new Response(JSON.stringify({ error: "phone is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!otp) {
      return new Response(JSON.stringify({ error: "otp is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the latest OTP row for this phone
    // NOTE: requires created_at to exist for correct ordering
    const { data, error } = await supabaseAdmin
      .from("phone_otps")
      .select("id, otp_hash, expires_at, created_at")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const row = data?.[0];
    if (!row) {
      return new Response(
        JSON.stringify({ error: "No OTP found for this phone" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Expiry check
    const expiresMs = Date.parse(row.expires_at);
    if (Number.isNaN(expiresMs) || expiresMs < Date.now()) {
      // Optional cleanup of expired OTP
      if (row.id) {
        await supabaseAdmin.from("phone_otps").delete().eq("id", row.id);
      }

      return new Response(JSON.stringify({ error: "OTP expired" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hash the OTP input and compare
    const candidate = await otpHash(String(otp), phone);
    const isValid = constantTimeEqual(candidate, row.otp_hash);

    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid OTP" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Success: invalidate OTP so it can't be reused
    // (Deleting is simplest if you don't have consumed_at column yet)
    if (row.id) {
      const { error: delErr } = await supabaseAdmin
        .from("phone_otps")
        .delete()
        .eq("id", row.id);

      if (delErr) {
        return new Response(JSON.stringify({ error: delErr.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, phone }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/verify-otp' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
