import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const supabaseClient = (supabaseToken: string): SupabaseClient => {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${supabaseToken}`,
                },
            },
        }
    );

    return supabase;
};
