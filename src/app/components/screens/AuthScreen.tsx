import { motion } from "motion/react";
import { Lock, ShieldCheck, ShoppingCart } from "lucide-react";

interface AuthScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  loading: boolean;
  configError?: string | null;
}

export function AuthScreen({ onLogin, onRegister, loading, configError }: AuthScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div
          className="flex flex-col bg-white rounded-3xl overflow-hidden"
          style={{ boxShadow: "0 20px 60px rgba(99,102,241,0.12), 0 4px 20px rgba(0,0,0,0.06)" }}
        >
          {/* Header */}
          <div className="flex flex-col items-center pt-12 pb-8 px-6">
            <div className="w-16 h-16 rounded-[20px] bg-indigo-600 flex items-center justify-center shadow-xl mb-5">
              <ShoppingCart className="w-8 h-8 text-white" strokeWidth={1.8} />
            </div>
            <h1 className="text-gray-900" style={{ fontSize: 26, fontWeight: 700 }}>
              Entrar com Keycloak
            </h1>
            <p className="text-gray-500 mt-2 text-center" style={{ fontSize: 14 }}>
              A autenticacao e feita no teu servidor de identidade com Authorization Code + PKCE.
            </p>
          </div>

          {/* Info cards */}
          <div className="px-6 pb-6">
            <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>
                    Login seguro
                  </p>
                  <p className="text-gray-500 mt-1" style={{ fontSize: 13 }}>
                    As credenciais nao passam pelo frontend. O login e feito na pagina oficial do Keycloak.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Lock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>
                    Token com refresh
                  </p>
                  <p className="text-gray-500 mt-1" style={{ fontSize: 13 }}>
                    O access token e renovado automaticamente enquanto a sessao estiver ativa.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-8 flex flex-col gap-3">
            {configError && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                <p className="text-red-600" style={{ fontSize: 13, fontWeight: 600 }}>
                  {configError}
                </p>
              </div>
            )}
            <motion.button
              onClick={onLogin}
              disabled={loading || Boolean(configError)}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#4F46E5" }}
            >
              {loading ? (
                <span className="text-white" style={{ fontSize: 16, fontWeight: 600 }}>
                  A redirecionar...
                </span>
              ) : (
                <span className="text-white" style={{ fontSize: 16, fontWeight: 600 }}>
                  Continuar com Keycloak
                </span>
              )}
            </motion.button>
            <motion.button
              onClick={onRegister}
              disabled={loading || Boolean(configError)}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 border border-indigo-200 bg-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="text-indigo-700" style={{ fontSize: 16, fontWeight: 600 }}>
                Criar conta
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
