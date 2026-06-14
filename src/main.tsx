import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { AuthProvider } from "./auth/AuthProvider";
import { brand } from "./brand.config";
import "./styles/index.css";

// Inject brand colours into CSS custom properties so all var(--brand-*)
// references stay in sync with the env-based brand config.
const root = document.documentElement;
root.style.setProperty("--brand", brand.colors.primary);
root.style.setProperty("--brand-light", brand.colors.primaryLight);
root.style.setProperty("--brand-muted", brand.colors.primaryMuted);

document.title = brand.name;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
