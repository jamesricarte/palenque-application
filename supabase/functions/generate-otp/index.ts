// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import axios from "npm:axios@1.6.2";

const enc = new TextEncoder();

const HMAC_KEY = await crypto.subtle.importKey(
  "raw",
  enc.encode(Deno.env.get("OTP_PEPPER")!),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign"],
);

const generateOtp6 = (): string => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);

  const otp = (buf[0] % 1_000_000).toString().padStart(6, "0");
  return otp;
};

const hex = (buf: ArrayBuffer) => {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0"))
    .join(
      "",
    );
};

const otpHash = async (otp: string, phone: string) => {
  const sig = await crypto.subtle.sign(
    "HMAC",
    HMAC_KEY,
    enc.encode(`${phone}:${otp}`),
  );
  return hex(sig);
};

Deno.serve(async (req) => {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return new Response(JSON.stringify({ error: "phone is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const otp = generateOtp6();
    console.log("Otp:", otp);
    const otp_hash = await otpHash(otp, phone);
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error } = await supabaseAdmin.from("phone_otps").insert({
      phone,
      otp_hash,
      expires_at,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    // Send OTP via sms provider
    // try {
    //   const response = await axios.post(
    //     "https://sms-api-ph-gceo.onrender.com/send/sms",
    //     {
    //       recipient: phone,
    //       message: `Your verification code is ${otp}`,
    //     },
    //     {
    //       headers: {
    //         "x-api-key": "sk-8ea40031593fed87ac91b34f",
    //         "Content-Type": "application/json",
    //       },
    //     },
    //   );

    //   if (response.data) {
    //     console.log("Response from sms-api-ph:", response.data);
    //   }
    // } catch (error: any) {
    //   console.error(
    //     "Error sending sms:",
    //     error?.response?.data || error?.message || error,
    //   );

    //   return new Response(
    //     JSON.stringify({
    //       error: error?.response?.data?.error ||
    //         error?.response?.data || error?.message || error ||
    //         "Unknown error",
    //       message: "Error sending otp to your phone number.",
    //     }),
    //     {
    //       status: 500,
    //     },
    //   );
    // }

    return new Response(
      JSON.stringify({ success: true, phone }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-otp' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
