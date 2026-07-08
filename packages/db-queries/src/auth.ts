import { supabase, serviceClient } from "@repo/db-connector/db";

type LoginDBType = {
    signUpUser(email: string, password: string): Promise<any>;
    signInUser(email: string, password: string): Promise<any>;
    validateToken(token: string): Promise<any>;
    sendPasswordResetEmail(email: string, redirectTo: string): Promise<any>;
    updatePasswordWithToken(token: string, newPassword: string): Promise<any>;
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
    },
    async sendPasswordResetEmail(email: string, redirectTo: string) {
        return supabase.auth.resetPasswordForEmail(email, { redirectTo });
    },
    async updatePasswordWithToken(token: string, newPassword: string) {
        const { data, error } = await serviceClient.auth.getUser(token);

        if (error || !data.user) {
            return { data: null, error: error ?? { message: "Invalid or expired token" } };
        }

        return serviceClient.auth.admin.updateUserById(data.user.id, { password: newPassword });
    }
};