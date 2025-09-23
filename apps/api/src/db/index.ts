/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable turbo/no-undeclared-env-vars */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

import { Database } from "../types/db.js";

config();

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);
