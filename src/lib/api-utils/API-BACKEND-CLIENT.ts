/**
 * Supabase Backend API client.
 * Uses the Supabase Service Role Key to authenticate, so should never be exposed to the client.
 */

import { supabasePUBLIC_URL } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseBACKEND = createClient(
	supabasePUBLIC_URL,
	supabaseServiceRoleKey
);

export { supabaseBACKEND };
