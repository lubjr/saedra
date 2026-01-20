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

const UserContext = React.createContext<{
  user: UserContextType;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}>({
  user: null,
  isLoading: true,
  refreshUser: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserContextType>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchUser = async () => {
    setIsLoading(true);
    const userData = await getUser();
    setUser(userData?.user || null);
    setIsLoading(false);
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  return React.useContext(UserContext);
};
