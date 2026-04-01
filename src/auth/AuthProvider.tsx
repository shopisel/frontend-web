import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { keycloak, isKeycloakConfigured } from "./keycloak";
import type { KeycloakTokenParsed } from "keycloak-js";

type AuthUser = {
  name?: string;
  email?: string;
  username?: string;
};

type AuthContextValue = {
  initialized: boolean;
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  configError: string | null;
  login: () => Promise<void>;
  register: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
let keycloakInitPromise: Promise<boolean> | null = null;

type TokenWithUserFields = KeycloakTokenParsed & {
  name?: string;
  email?: string;
  preferred_username?: string;
};

function userFromToken(token: TokenWithUserFields | undefined): AuthUser | null {
  if (!token) return null;

  return {
    name: token.name,
    email: token.email,
    username: token.preferred_username,
  };
}

function initKeycloakOnce() {
  if (!keycloak) {
    return Promise.resolve(false);
  }

  if (!keycloakInitPromise) {
    keycloakInitPromise = keycloak.init({
      onLoad: "check-sso",
      pkceMethod: "S256",
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    });
  }

  return keycloakInitPromise;
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [initialized, setInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const syncState = useCallback(() => {
    if (!keycloak) return;
    setIsAuthenticated(Boolean(keycloak.authenticated));
    setToken(keycloak.token ?? null);
    setUser(userFromToken(keycloak.tokenParsed as TokenWithUserFields | undefined));
  }, []);

  useEffect(() => {
    if (!isKeycloakConfigured || !keycloak) {
      setConfigError(
        "Keycloak nao configurado. Define VITE_KEYCLOAK_URL, VITE_KEYCLOAK_REALM e VITE_KEYCLOAK_CLIENT_ID."
      );
      setInitialized(true);
      return;
    }

    const kc = keycloak;
    let mounted = true;

    initKeycloakOnce()
      .then(() => {
        if (!mounted) return;
        syncState();
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        const errorMessage =
          error instanceof Error ? error.message : typeof error === "string" ? error : "erro desconhecido";
        setConfigError(`Falha ao inicializar autenticacao com Keycloak: ${errorMessage}`);
      })
      .finally(() => {
        if (!mounted) return;
        setInitialized(true);
      });

    kc.onAuthSuccess = syncState;
    kc.onAuthRefreshSuccess = syncState;
    kc.onAuthLogout = () => {
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
    };
    kc.onTokenExpired = () => {
      void kc
        .updateToken(30)
        .then(syncState)
        .catch(() => {
          setIsAuthenticated(false);
          setToken(null);
          setUser(null);
        });
    };

    const refreshTimer = window.setInterval(() => {
      if (!kc.authenticated) return;
      void kc.updateToken(30).then(syncState).catch(() => undefined);
    }, 20_000);

    return () => {
      mounted = false;
      window.clearInterval(refreshTimer);
      kc.onAuthSuccess = undefined;
      kc.onAuthRefreshSuccess = undefined;
      kc.onAuthLogout = undefined;
      kc.onTokenExpired = undefined;
    };
  }, [syncState]);

  const login = useCallback(async () => {
    if (!keycloak) return;
    await keycloak.login({
      redirectUri: `${window.location.origin}/`,
    });
  }, []);

  const logout = useCallback(async () => {
    if (!keycloak) return;
    await keycloak.logout({
      redirectUri: `${window.location.origin}/`,
    });
  }, []);

  const register = useCallback(async () => {
    if (!keycloak) return;
    await keycloak.login({
      action: "register",
      redirectUri: `${window.location.origin}/`,
    });
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!keycloak || !keycloak.authenticated) return null;
    try {
      await keycloak.updateToken(30);
      syncState();
      return keycloak.token ?? null;
    } catch {
      return null;
    }
  }, [syncState]);

  const value = useMemo<AuthContextValue>(
    () => ({
      initialized,
      isAuthenticated,
      token,
      user,
      configError,
      login,
      register,
      logout,
      getAccessToken,
    }),
    [initialized, isAuthenticated, token, user, configError, login, register, logout, getAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
