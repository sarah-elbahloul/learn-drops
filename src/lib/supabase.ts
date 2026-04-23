import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anon) {
  console.warn(
    "[LearnDrops] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env. " +
      "Auth and database features will not work until they are set."
  );
}

export const supabase = createClient(url ?? "https://placeholder.supabase.co", anon ?? "placeholder-anon-key", {
  auth: { persistSession: true, autoRefreshToken: true },
});

export type Drop = {
  id: string;
  user_id: string;
  content: string;
  link: string | null;
  tag: string | null;
  tag_color: string | null;
  created_at: string;
};

export const isSupabaseConfigured = Boolean(url && anon);