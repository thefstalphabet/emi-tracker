import { supabaseClient } from "@/utils/supabase-client";

export const getEmi = async (token: string, query: unknown) => {
  const supabase = await supabaseClient(token);
  const { data: todos } = await supabase.from("emi").select("*");
  return todos;
};
