"use client";

import * as React from "react";

import { getUser } from "../../auth/user";

export type SupabaseUser = {
  id: string;
  email: string;
  role: string;
  aud: string;
  created_at: string;
  updated_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  identities: Array<{
    identity_id: string;
    id: string;
    user_id: string;
    provider: string;
    email: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
  }>;
  last_sign_in_at: string;
  confirmed_at: string | null;
  email_confirmed_at: string | null;
  is_anonymous: boolean;
};

type UserContextType = SupabaseUser | null;

const UserContext = React.createContext<UserContextType>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserContextType>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData?.user?.user || null);
    };

    fetchUser();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return React.useContext(UserContext);
};
