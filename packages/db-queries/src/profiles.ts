import { supabase } from "@repo/db-connector/db";

type ProfileDBType = {
  getProfileByUser(userId: string): Promise<any>;
  updateProfileByUser(userId: string, username: string, avatar_url: string): Promise<any>;
};

export const ProfileDB: ProfileDBType = {
  async getProfileByUser(userId: string) {
    return supabase.from('profiles').select('*').eq('id', userId).single();
  },

  async updateProfileByUser(userId: string, username: string, avatar_url: string) {
    return supabase.from('profiles').update({ username, avatar_url }).eq('id', userId).select();
  }
};