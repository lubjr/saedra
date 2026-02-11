import { createClient } from "@supabase/supabase-js";

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const SUPABASE_URL = getRequiredEnv("SUPABASE_URL");
const SUPABASE_ANON_KEY = getRequiredEnv("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);