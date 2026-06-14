/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KEYCLOAK_URL: string;
  readonly VITE_KEYCLOAK_REALM: string;
  readonly VITE_KEYCLOAK_CLIENT_ID: string;
  readonly VITE_API_BASE_URL?: string;

  // White-label / custom brand inputs
  readonly VITE_BRAND_NAME?: string;
  readonly VITE_BRAND_TAGLINE?: string;
  readonly VITE_BRAND_LOGO_URL?: string;
  readonly VITE_BRAND_SIDEBAR_TAGLINE?: string;
  readonly VITE_BRAND_COLOR_PRIMARY?: string;
  readonly VITE_BRAND_COLOR_SECONDARY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
