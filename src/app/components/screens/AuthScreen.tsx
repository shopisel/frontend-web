import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, ShoppingCart, Mail, Lock, User, Check } from "lucide-react";

interface AuthScreenProps {
  onComplete: () => void;
}

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(onComplete, 1000);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-indigo-50 to-white overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center pt-12 pb-8">
        <div className="w-16 h-16 rounded-[20px] bg-indigo-600 flex items-center justify-center shadow-xl mb-4">
          <ShoppingCart className="w-8 h-8 text-white" strokeWidth={1.8} />
        </div>
        <h1 className="text-gray-900" style={{ fontSize: 26, fontWeight: 700 }}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-gray-500 mt-1" style={{ fontSize: 14 }}>
          {mode === "login" ? "Sign in to your SmartCart account" : "Start shopping smarter today"}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="mx-6 mb-6">
        <div className="flex bg-gray-100 rounded-2xl p-1">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2.5 rounded-xl relative"
            >
              {mode === m && (
                <motion.div
                  layoutId="auth-tab"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm"
                />
              )}
              <span
                className="relative z-10"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: mode === m ? "#111827" : "#6B7280",
                }}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col px-6 gap-4">
        <AnimatePresence mode="wait">
          {mode === "signup" && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none shadow-sm"
                  style={{ fontSize: 15, color: "#111827" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email address"
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none shadow-sm"
            style={{ fontSize: 15, color: "#111827" }}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-12 pr-12 py-4 bg-white border border-gray-100 rounded-2xl outline-none shadow-sm"
            style={{ fontSize: 15, color: "#111827" }}
          />
          <button
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showPass ? (
              <EyeOff className="w-5 h-5 text-gray-400" />
            ) : (
              <Eye className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {mode === "login" && (
          <button className="self-end" style={{ fontSize: 13, fontWeight: 600, color: "#6366F1" }}>
            Forgot password?
          </button>
        )}

        {/* Submit button */}
        <motion.button
          onClick={handleSubmit}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl mt-2 flex items-center justify-center gap-2 shadow-lg"
          style={{ backgroundColor: "#6366F1" }}
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check className="w-5 h-5 text-white" />
                <span className="text-white" style={{ fontSize: 16, fontWeight: 600 }}>
                  Success!
                </span>
              </motion.div>
            ) : loading ? (
              <motion.div key="loading" className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-white"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.span
                key="text"
                className="text-white"
                style={{ fontSize: 16, fontWeight: 600 }}
              >
                {mode === "login" ? "Sign In" : "Create Account"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Social divider */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-400" style={{ fontSize: 12 }}>or continue with</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Social buttons */}
        <div className="flex gap-3">
          {[
            { label: "Google", color: "#EA4335" },
            { label: "Apple", color: "#000000" },
            { label: "Facebook", color: "#1877F2" },
          ].map((s) => (
            <button
              key={s.label}
              className="flex-1 py-3 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center"
              style={{ fontSize: 13, fontWeight: 600, color: s.color }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
