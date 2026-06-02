import { Star, User } from "lucide-react";

interface UserCardProps {
  displayName: string;
  displayEmail: string;
  initials: string;
  listCount: number;
  savings: number;
}

export function UserCard({ displayName, displayEmail, initials, listCount, savings }: UserCardProps) {
  return (
    <div className="px-5 pt-6 pb-6 bg-white">
      <h1 className="text-gray-900 mb-4" style={{ fontSize: 24, fontWeight: 700 }}>Perfil</h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
          <span className="text-white" style={{ fontSize: 24, fontWeight: 700 }}>{initials || "U"}</span>
        </div>
        <div className="flex-1">
          <p className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>{displayName}</p>
          <p className="text-indigo-200" style={{ fontSize: 13 }}>{displayEmail}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-yellow-300" fill="#FCD34D" />
            <span className="text-white/80" style={{ fontSize: 12 }}>Membro Premium</span>
          </div>
        </div>
        <button className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: "Listas", value: String(listCount) },
          { label: "Poupado", value: `€${savings.toFixed(2)}` },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-50 rounded-2xl p-3 text-center min-w-0">
            <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 800 }}>{stat.value}</p>
            <p className="text-gray-400" style={{ fontSize: 12 }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
