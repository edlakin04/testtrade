import { createClient } from "@supabase/supabase-js";

function required(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export function supabaseServer() {
  const url = required("SUPABASE_URL", process.env.SUPABASE_URL);
  const serviceKey = required("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
