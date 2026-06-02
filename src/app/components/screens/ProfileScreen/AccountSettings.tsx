import { motion } from "motion/react";
import { User, KeyRound, Pencil, LogOut } from "lucide-react";
import { keycloak } from "../../../../auth/keycloak";

interface AccountSettingsProps {
  username?: string;
  email?: string;
  onLogout: () => void;
}

export function AccountSettings({ username, email, onLogout }: AccountSettingsProps) {
  return (
    <>
      <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-indigo-600" />
          <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Dados da Conta</p>
        </div>

        <div className="mb-3">
          <p className="text-gray-400 mb-1" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Nome de utilizador
          </p>
          <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 600 }}>{username || "—"}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-400 mb-1" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            E-mail
          </p>
          <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 600 }}>{email || "—"}</p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => void keycloak?.login({ action: "UPDATE_PASSWORD" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ backgroundColor: "var(--brand-light)" }}
          >
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <span className="text-indigo-700" style={{ fontSize: 13, fontWeight: 600 }}>Alterar palavra-passe</span>
          </button>
          <button
            type="button"
            onClick={() => void keycloak?.accountManagement()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ backgroundColor: "#F9FAFB" }}
          >
            <Pencil className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Editar perfil</span>
          </button>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onLogout}
        className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 bg-red-50 mb-6"
      >
        <LogOut className="w-4 h-4 text-red-500" />
        <span className="text-red-500" style={{ fontSize: 14, fontWeight: 600 }}>Terminar Sessão</span>
      </motion.button>
    </>
  );
}
