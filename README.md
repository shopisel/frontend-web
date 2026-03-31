# frontend

## Keycloak no frontend (Vite + React)

1. Copia `.env.example` para `.env`.
2. Preenche:
   - `VITE_KEYCLOAK_URL`
   - `VITE_KEYCLOAK_REALM`
   - `VITE_KEYCLOAK_CLIENT_ID`
3. No cliente do Keycloak, garante:
   - `Standard Flow` ativo
   - PKCE `S256`
   - `Valid Redirect URIs`: `http://localhost:5173/*`
   - `Web Origins`: `http://localhost:5173`
4. Corre `npm run dev`.

O login e feito por redirect para o Keycloak. O token fica em memoria no frontend e e renovado automaticamente.
