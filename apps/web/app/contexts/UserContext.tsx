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
}>({
  user: null,
  isLoading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserContextType>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const userData = await getUser();
      setUser(userData?.user || null);
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  return React.useContext(UserContext);
};
