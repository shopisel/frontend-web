import { motion } from "motion/react";
import { Loader } from "lucide-react";
import type { Category } from "../../../../api/useProducts";

interface CategoryFilterProps {
  mainCategories: Category[];
  selectedMainCat: Category | null;
  isLoadingCats: boolean;
  subCategories: Category[];
  selectedSubCat: Category | null;
  isLoadingSubCats: boolean;
  onSelectMainCategory: (cat: Category | null) => void;
  onSelectSubCategory: (cat: Category) => void;
}

export function CategoryFilter({
  mainCategories,
  selectedMainCat,
  isLoadingCats,
  subCategories,
  selectedSubCat,
  isLoadingSubCats,
  onSelectMainCategory,
  onSelectSubCategory,
}: CategoryFilterProps) {
  return (
    <>
      <div className="bg-white pb-3 pt-1">
        <div className="flex gap-2 px-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <motion.button
            key="__all__"
            onClick={() => onSelectMainCategory(null)}
            className="flex-shrink-0 px-4 py-2 rounded-xl"
            animate={{
              backgroundColor: selectedMainCat === null ? "var(--brand)" : "#F3F4F6",
              color: selectedMainCat === null ? "#FFFFFF" : "#6B7280",
            }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            Todos
          </motion.button>

          {isLoadingCats ? (
            <div className="flex items-center gap-2 px-2 text-gray-400">
              <Loader className="w-4 h-4 animate-spin" />
              <span style={{ fontSize: 13, fontWeight: 600 }}>A carregar</span>
            </div>
          ) : (
            mainCategories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => onSelectMainCategory(cat)}
                className="flex-shrink-0 px-4 py-2 rounded-xl"
                animate={{
                  backgroundColor: cat.id === selectedMainCat?.id ? "var(--brand)" : "#F3F4F6",
                  color: cat.id === selectedMainCat?.id ? "#FFFFFF" : "#6B7280",
                }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                {cat.name}
              </motion.button>
            ))
          )}
        </div>
      </div>

      {selectedMainCat && (
        <div className="bg-white pb-3">
          <div className="flex gap-2 px-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {isLoadingSubCats ? (
              <div className="flex items-center gap-2 px-2 text-gray-400">
                <Loader className="w-4 h-4 animate-spin" />
                <span style={{ fontSize: 13, fontWeight: 600 }}>A carregar</span>
              </div>
            ) : subCategories.length > 0 ? (
              subCategories.map((subCat) => (
                <motion.button
                  key={subCat.id}
                  onClick={() => onSelectSubCategory(subCat)}
                  className="flex-shrink-0 px-4 py-2 rounded-xl"
                  animate={{
                    backgroundColor: subCat.id === selectedSubCat?.id ? "#111827" : "#F3F4F6",
                    color: subCat.id === selectedSubCat?.id ? "#FFFFFF" : "#6B7280",
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  {subCat.name}
                </motion.button>
              ))
            ) : (
              <div className="text-gray-400" style={{ fontSize: 13, fontWeight: 600 }}>
                Sem subcategorias
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
