import { TrendingDown, ShoppingBag } from "lucide-react";

interface SummaryStatsProps {
  totalListItems: number;
  savings: number;
}

export function SummaryStats({ totalListItems, savings }: SummaryStatsProps) {
  const stats = [
    { label: "Artigos", value: String(totalListItems), icon: ShoppingBag, color: "var(--brand)", bg: "var(--brand-light)" },
    { label: "Poupado", value: `€${savings.toFixed(2)}`, icon: TrendingDown, color: "var(--success)", bg: "var(--success-light)" },
  ];

  return (
    <div className="px-5 py-4 grid grid-cols-2 gap-3 sm:flex">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl p-3 flex flex-col gap-1 min-w-0 sm:flex-1"
            style={{ backgroundColor: stat.bg }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: stat.color + "22" }}
            >
              <Icon className="w-4 h-4" style={{ color: stat.color }} strokeWidth={2} />
            </div>
            <span className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>{stat.value}</span>
            <span className="text-gray-500" style={{ fontSize: 11 }}>{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
