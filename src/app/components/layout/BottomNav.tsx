import { motion } from "motion/react";
import { Home, List, BarChart2, User } from "lucide-react";

export type AppTab = "home" | "lists" | "prices" | "profile";

const tabs: { id: AppTab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Início", icon: Home },
  { id: "lists", label: "Listas", icon: List },
  { id: "prices", label: "Preços", icon: BarChart2 },
  { id: "profile", label: "Perfil", icon: User },
];

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div
      className="flex items-stretch bg-white/95 backdrop-blur border-t border-gray-100 px-2 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
      style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 relative"
          >
            <div className="relative flex flex-col items-center gap-1 w-full py-1">
              {/* Active indicator pill */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1.5 w-8 h-1 rounded-full bg-indigo-600"
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                />
              )}
              <div className="relative">
                <Icon
                  className="w-6 h-6 transition-colors"
                  style={{ color: isActive ? "var(--brand)" : "#9CA3AF" }}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--brand)" : "#9CA3AF",
                }}
              >
                {tab.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
