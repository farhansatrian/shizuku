"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface PublicEcosystemUser {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

interface EcosystemAuthContextValue {
  user: PublicEcosystemUser | null;
  loading: boolean;
  setUser: (next: PublicEcosystemUser | null) => void;
  refresh: () => Promise<PublicEcosystemUser | null>;
  signOut: () => Promise<void>;
}

const EcosystemAuthContext = createContext<EcosystemAuthContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
  refresh: async () => null,
  signOut: async () => {},
});

export function EcosystemAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<PublicEcosystemUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (): Promise<PublicEcosystemUser | null> => {
    try {
      const res = await fetch("/api/ecosystem/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        setUser(null);
        return null;
      }
      const data = (await res.json()) as { user?: PublicEcosystemUser | null };
      const nextUser = data.user ?? null;
      setUser(nextUser);
      return nextUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/ecosystem/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { user?: PublicEcosystemUser | null } | null) => {
        if (!active) return;
        setUser(data?.user ?? null);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/ecosystem/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <EcosystemAuthContext.Provider
      value={{ user, loading, setUser, refresh, signOut }}
    >
      {children}
    </EcosystemAuthContext.Provider>
  );
}

export function useEcosystemAuth() {
  return useContext(EcosystemAuthContext);
}
