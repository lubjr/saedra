import { randomBytes, createHash } from "node:crypto";
import { serviceClient } from "@repo/db-connector/db";

const TOKEN_PREFIX = "saedra_pat_";
const TOKEN_PREFIX_LENGTH = 12;

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

type ApiTokenDBType = {
  createApiToken(userId: string, name: string): Promise<any>;
  getUserIdByTokenHash(hash: string): Promise<string | null>;
  listApiTokensByUser(userId: string): Promise<any>;
  revokeApiToken(id: string, userId: string): Promise<any>;
};

export const ApiTokenDB: ApiTokenDBType = {
  async createApiToken(userId: string, name: string) {
    const token = `${TOKEN_PREFIX}${randomBytes(32).toString("hex")}`;
    const tokenHash = hashToken(token);
    const tokenPrefix = token.slice(0, TOKEN_PREFIX_LENGTH);

    const { data, error } = await serviceClient
      .from("api_tokens")
      .insert({ user_id: userId, name, token_hash: tokenHash, token_prefix: tokenPrefix })
      .select("id, name, token_prefix, created_at")
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: { ...data, token }, error: null };
  },

  async getUserIdByTokenHash(hash: string) {
    const { data, error } = await serviceClient
      .from("api_tokens")
      .select("id, user_id")
      .eq("token_hash", hash)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    serviceClient
      .from("api_tokens")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", data.id)
      .then(
        () => {},
        () => {}
      );

    return data.user_id;
  },

  async listApiTokensByUser(userId: string) {
    return serviceClient
      .from("api_tokens")
      .select("id, name, token_prefix, created_at, last_used_at, expires_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  },

  async revokeApiToken(id: string, userId: string) {
    return serviceClient.from("api_tokens").delete().eq("id", id).eq("user_id", userId);
  },
};
