import { useEffect } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Sparkles } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 relative overflow-hidden">
      {/* Background circles */}
      <motion.div
        className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-white/10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-[-60px] left-[-60px] w-48 h-48 rounded-full bg-white/10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-[30%] right-[-40px] w-32 h-32 rounded-full bg-white/5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      />

      {/* Logo */}
      <motion.div
        className="flex flex-col items-center gap-5"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="w-24 h-24 rounded-[28px] bg-white flex items-center justify-center shadow-2xl">
          <ShoppingCart className="w-12 h-12 text-indigo-600" strokeWidth={1.8} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-white" style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.5 }}>
            SmartCart
          </h1>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <p className="text-indigo-200" style={{ fontSize: 13, fontWeight: 500 }}>
              Shop smarter, save more
            </p>
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          </div>
        </div>
      </motion.div>

      {/* Loading dots */}
      <motion.div
        className="absolute bottom-16 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white/60"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </motion.div>
    </div>
  );
}
