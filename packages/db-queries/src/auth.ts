import { supabase, serviceClient } from "@repo/db-connector/db";

type LoginDBType = {
    signUpUser(email: string, password: string): Promise<any>;
    signInUser(email: string, password: string): Promise<any>;
    validateToken(token: string): Promise<any>;
}

export const LoginDB: LoginDBType = {
    async signUpUser(email: string, password: string) {
        return supabase.auth.signUp({ email, password });
    },
    async signInUser(email: string, password: string) {
        return supabase.auth.signInWithPassword({ email, password });
    },
    async validateToken(token: string) {
        return serviceClient.auth.getUser(token);
    }
};