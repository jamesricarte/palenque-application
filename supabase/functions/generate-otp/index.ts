// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.0"

const supabaseUrl = Deno.env.get("_SUPABASE_URL") as string
const supabaseKey = Deno.env.get("_SUPABASE_SERVICE_ROLE_KEY") as string
const supabase = createClient(supabaseUrl, supabaseKey)

function generateOtp6(): string {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)

  const otp = (buf[0] % 1_000_000).toString().padStart(6, "0")
  return otp
}

// --- helpers ---
const enc = new TextEncoder()

function toBase64Url(bytes: ArrayBuffer) {
  const u8 = new Uint8Array(bytes)
  let bin = ""
  for (const b of u8) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function hmacOtp(otp: string, phone: string) {
  const pepper = Deno.env.get("OTP_PEPPER")!
  // include phone so the same OTP for different phones != same hash
  const msg = `${phone}:${otp}`

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(pepper),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )

  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg))
  return toBase64Url(sig)
}

Deno.serve(async (req) => {
  try {
    const { phone } = await req.json()

  if (!phone) {
    return new Response(JSON.stringify({error: "phone is required"}), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    })
  }

  const otp = generateOtp6()

    // Store hashed OTP + expiry in DB, then send OTP via SMS provider
  const otp_hash = await hmacOtp(otp, phone)
  const expires_at = new Date(Date.now() + 5 * 60 * 1000).toString()

  const { error } = await supabase.from("phone_otps").insert({
    phone,
    otp: otp_hash,
    expires_at
  })

  if (error) {
    return new Response(JSON.stringify({error: error.message}), {status: 500})
  }

  return new Response(
    JSON.stringify({ ok: true}),
    { headers: { "Content-Type": "application/json" } },
  )
  } catch (error) {
    return new Response(JSON.stringify({error: error}), {
      status: 400,
      headers: { "Content-Type": "application/json"}
    })
  }
  
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-otp' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
