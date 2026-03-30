import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SplashScreen } from "./components/screens/SplashScreen";
import { OnboardingScreen } from "./components/screens/OnboardingScreen";
import { AuthScreen } from "./components/screens/AuthScreen";
import { HomeScreen } from "./components/screens/HomeScreen";
import { ListsScreen } from "./components/screens/ListsScreen";
import { ScanScreen } from "./components/screens/ScanScreen";
import { PricesScreen } from "./components/screens/PricesScreen";
import { AlertsScreen } from "./components/screens/AlertsScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";
import { BottomNav, AppTab } from "./components/layout/BottomNav";

type AppFlow = "splash" | "onboarding" | "auth" | "app";

const screenVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const tabVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function App() {
  const [flow, setFlow] = useState<AppFlow>("splash");
  const [activeTab, setActiveTab] = useState<AppTab>("home");

  const handleTabChange = useCallback((tab: AppTab) => {
    setActiveTab(tab);
  }, []);

  const handleNavigate = useCallback((tab: string) => {
    setActiveTab(tab as AppTab);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 flex items-center justify-center p-4">
      {/* Phone frame */}
      <div
        className="relative bg-white overflow-hidden"
        style={{
          width: 390,
          height: 844,
          maxHeight: "calc(100vh - 32px)",
          borderRadius: 44,
          boxShadow: "0 40px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.8)",
        }}
      >
        {/* Status bar */}
        {flow !== "splash" && (
          <div
            className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
            style={{ height: 44, paddingTop: 6 }}
          >
            <span className="text-gray-800" style={{ fontSize: 15, fontWeight: 600 }}>9:41</span>
            <div
              className="bg-black rounded-full"
              style={{ width: 120, height: 34, position: "absolute", left: "50%", transform: "translateX(-50%)", top: 0 }}
            />
            <div className="flex items-center gap-1.5">
              {/* Signal bars */}
              <div className="flex items-end gap-0.5">
                {[3, 5, 7, 9].map((h, i) => (
                  <div key={i} className="w-1 rounded-sm bg-gray-800" style={{ height: h }} />
                ))}
              </div>
              {/* WiFi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M8 10a1 1 0 100 2 1 1 0 000-2z" fill="#1F2937" />
                <path d="M5.5 7.5a3.5 3.5 0 015 0" stroke="#1F2937" strokeWidth={1.5} strokeLinecap="round" />
                <path d="M3 5a6 6 0 0110 0" stroke="#1F2937" strokeWidth={1.5} strokeLinecap="round" />
                <path d="M0.5 2.5a9.5 9.5 0 0115 0" stroke="#1F2937" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
              {/* Battery */}
              <div className="flex items-center">
                <div className="border border-gray-800 rounded-sm flex items-center" style={{ width: 22, height: 12, padding: 1.5 }}>
                  <div className="bg-gray-800 rounded-sm" style={{ width: "80%", height: "100%" }} />
                </div>
                <div className="bg-gray-800 rounded-r" style={{ width: 2, height: 6, marginLeft: 1 }} />
              </div>
            </div>
          </div>
        )}

        {/* App content */}
        <div className="absolute inset-0 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {flow === "splash" && (
              <motion.div
                key="splash"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <SplashScreen onComplete={() => setFlow("onboarding")} />
              </motion.div>
            )}

            {flow === "onboarding" && (
              <motion.div
                key="onboarding"
                className="absolute inset-0"
                {...screenVariants}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <OnboardingScreen onComplete={() => setFlow("auth")} />
              </motion.div>
            )}

            {flow === "auth" && (
              <motion.div
                key="auth"
                className="absolute inset-0"
                {...screenVariants}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <AuthScreen onComplete={() => setFlow("app")} />
              </motion.div>
            )}

            {flow === "app" && (
              <motion.div
                key="app"
                className="absolute inset-0 flex flex-col"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Screen content */}
                <div className="flex-1 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {activeTab === "home" && (
                      <motion.div key="home" className="absolute inset-0" {...tabVariants} transition={{ duration: 0.25 }}>
                        <HomeScreen onNavigate={handleNavigate} />
                      </motion.div>
                    )}
                    {activeTab === "lists" && (
                      <motion.div key="lists" className="absolute inset-0" {...tabVariants} transition={{ duration: 0.25 }}>
                        <ListsScreen onNavigate={handleNavigate} />
                      </motion.div>
                    )}
                    {activeTab === "scan" && (
                      <motion.div key="scan" className="absolute inset-0" {...tabVariants} transition={{ duration: 0.25 }}>
                        <ScanScreen onNavigate={handleNavigate} />
                      </motion.div>
                    )}
                    {activeTab === "prices" && (
                      <motion.div key="prices" className="absolute inset-0" {...tabVariants} transition={{ duration: 0.25 }}>
                        <PricesScreen />
                      </motion.div>
                    )}
                    {activeTab === "alerts" && (
                      <motion.div key="alerts" className="absolute inset-0" {...tabVariants} transition={{ duration: 0.25 }}>
                        <AlertsScreen />
                      </motion.div>
                    )}
                    {activeTab === "profile" && (
                      <motion.div key="profile" className="absolute inset-0" {...tabVariants} transition={{ duration: 0.25 }}>
                        <ProfileScreen onLogout={() => setFlow("splash")} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom navigation */}
                <BottomNav
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  alertCount={5}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phone frame decorations */}
        {/* Side buttons */}
        <div
          className="absolute bg-gray-300 rounded-r"
          style={{ left: -3, top: 140, width: 3, height: 32, borderRadius: "2px 0 0 2px" }}
        />
        <div
          className="absolute bg-gray-300"
          style={{ left: -3, top: 190, width: 3, height: 56, borderRadius: "2px 0 0 2px" }}
        />
        <div
          className="absolute bg-gray-300"
          style={{ left: -3, top: 260, width: 3, height: 56, borderRadius: "2px 0 0 2px" }}
        />
        <div
          className="absolute bg-gray-300"
          style={{ right: -3, top: 190, width: 3, height: 80, borderRadius: "0 2px 2px 0" }}
        />
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #c7d2fe 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #a5f3fc 0%, transparent 70%)" }}
        />
      </div>
    </div>
  );
}
