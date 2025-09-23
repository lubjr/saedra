import { supabase } from "./index.js";

export const getUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) throw error;
  return data;
};
