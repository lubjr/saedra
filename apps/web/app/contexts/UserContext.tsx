"use client";

import * as React from "react";

import { getUser } from "../../auth/user";

type UserContextType = {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  updated_at: string;
} | null;

const UserContext = React.createContext<UserContextType>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserContextType>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData?.user || null);
    };

    fetchUser();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  return React.useContext(UserContext);
};
