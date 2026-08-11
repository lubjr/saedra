"use client";

import * as React from "react";
import useSWR from "swr";

import { cacheTags } from "../../auth/cache-tags";
import { getUser } from "../../auth/user";

type UserContextType = {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  plan: string;
  updated_at: string;
} | null;

const USER_KEY = cacheTags.user();

const fetchUser = async (): Promise<UserContextType> => {
  const userData = await getUser();
  return userData?.user ?? null;
};

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
  const {
    data: user,
    isLoading,
    mutate,
  } = useSWR(USER_KEY, fetchUser, {
    fallbackData: null,
    revalidateOnFocus: true,
    refreshInterval: 60_000,
  });

  const refreshUser = React.useCallback(async () => {
    await mutate();
  }, [mutate]);

  return (
    <UserContext.Provider
      value={{ user: user ?? null, isLoading, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  return React.useContext(UserContext);
};
