import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client for server-only jobs (e.g. the reminder cron) that need
// to read across every company, bypassing RLS. Never import this from code
// that runs in the browser or handles a specific user's request.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
