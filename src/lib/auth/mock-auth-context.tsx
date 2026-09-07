"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { AuthContextValue, AuthUser } from "./types";
import { AUTH_TOKEN_STORAGE_KEY } from "./constants";
import { createMockJwt, decodeMockJwt } from "./jwt";

const FAKE_USER: AuthUser = {
  sub: "mock|123456",
  name: "Test User",
  email: "test.user@example.com",
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type Listener = () => void;
let tokenListeners: Listener[] = [];

function subscribeToken(listener: Listener) {
  tokenListeners.push(listener);
  return () => {
    tokenListeners = tokenListeners.filter((l) => l !== listener);
  };
}

function getTokenSnapshot() {
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

function getServerTokenSnapshot() {
  return null;
}

function notifyTokenChange() {
  tokenListeners.forEach((listener) => listener());
}

/**
 * Resolves to false during the server-rendered pass and the first client
 * pass (so they match), then true once hydration completes. Used instead
 * of an effect + setState so reading the mock token never causes a
 * hydration mismatch or a lint-flagged "setState in effect".
 */
function useHasHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const hasHydrated = useHasHydrated();
  const token = useSyncExternalStore(
    subscribeToken,
    getTokenSnapshot,
    getServerTokenSnapshot,
  );
  const user = useMemo(() => decodeMockJwt(token), [token]);

  const login = useCallback(() => {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, createMockJwt(FAKE_USER));
    notifyTokenChange();
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    notifyTokenChange();
  }, []);

  const getAccessTokenSilently = useCallback(() => {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  }, []);

  const value: AuthContextValue = {
    user: hasHydrated ? user : null,
    isAuthenticated: hasHydrated && !!user,
    isLoading: !hasHydrated,
    error: undefined,
    login,
    loginWithRedirect: login,
    logout,
    getAccessTokenSilently,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within a MockAuthProvider");
  }
  return ctx;
}
