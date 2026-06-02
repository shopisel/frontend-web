import { Loader } from "lucide-react";
import type { Category } from "../../../../api/useProducts";

interface CategoryGridProps {
  categories: Category[];
  isLoading: boolean;
  getImageSrc: (cat: Category) => string | undefined;
  onSelect: (cat: Category) => void;
}

export function CategoryGrid({ categories, isLoading, getImageSrc, onSelect }: CategoryGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader className="w-6 h-6 animate-spin text-green-400" />
      </div>
    );
  }

  if (!categories.length) {
    return <p className="text-center text-gray-400 py-4" style={{ fontSize: 13 }}>Sem categorias disponíveis.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {categories.map(cat => {
        const imageSrc = getImageSrc(cat);
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat)}
            className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {imageSrc ? (
              <img src={imageSrc} alt={cat.name} className="w-12 h-12 object-cover rounded-lg bg-white shadow-sm" loading="lazy" decoding="async" fetchPriority="low" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm">📦</div>
            )}
            <p className="text-gray-900 text-center line-clamp-1" style={{ fontSize: 12, fontWeight: 600 }}>{cat.name}</p>
          </button>
        );
      })}
    </div>
  );
}
