import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
require("dotenv").config();

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);
