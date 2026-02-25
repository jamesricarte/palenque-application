import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.0";

export const supabaseAdmin = createClient(
    Deno.env.get("_SUPABASE_URL") as string,
    Deno.env.get("_SUPABASE_SERVICE_ROLE_KEY") as string,
);
