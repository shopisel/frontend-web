import { X } from "lucide-react";
import { useState } from "react";
import type { Product } from "../../../../api/useProducts";
import { ImageWithFallback } from "../../fallback/ImageWithFallback";
import { getProductImageSrc } from "../../../../lib/imageUtils";
import { RELATED_PRODUCTS_LIMIT } from "../../../../lib/constants";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "../../ui/drawer";

interface RelatedProductsDrawerProps {
  open: boolean;
  isLoading: boolean;
  products: Product[];
  onOpenChange: (open: boolean) => void;
  onSelectProduct: (product: Product) => void;
}

export function RelatedProductsDrawer({
  open,
  isLoading,
  products,
  onOpenChange,
  onSelectProduct,
}: RelatedProductsDrawerProps) {
  const [visibleCount, setVisibleCount] = useState(RELATED_PRODUCTS_LIMIT);
  const visible = products.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount(prev => prev + RELATED_PRODUCTS_LIMIT);
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-full border-l-0 bg-white p-0 sm:max-w-md">
        <div className="flex h-full min-h-0 flex-col">
          <DrawerHeader className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DrawerTitle className="text-gray-900" style={{ fontSize: 16 }}>
                  Produtos relacionados
                </DrawerTitle>
                <DrawerDescription className="text-gray-500 mt-1">
                  Encontra mais soluções.
                </DrawerDescription>
              </div>

              <DrawerClose asChild>
                <button
                  type="button"
                  className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500"
                  aria-label="Fechar relacionados"
                >
                  <X className="w-4 h-4" />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {isLoading ? (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-5 text-sm font-medium text-gray-500">
                A carregar relacionados...
              </div>
            ) : products.length > 0 ? (
              <div className="grid gap-3">
                {visible.map((product) => {
                  const imgSrc = getProductImageSrc(product);

                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        onSelectProduct(product);
                        onOpenChange(false);
                      }}
                      className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm transition-transform hover:-translate-y-0.5"
                    >
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center">
                        {imgSrc ? (
                          <ImageWithFallback src={imgSrc} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-2xl">{product.emoji || "📦"}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className="text-gray-900"
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            lineHeight: "18px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.name}
                        </p>
                        {product.brand && (
                          <p className="mt-1 truncate text-gray-500" style={{ fontSize: 12 }}>
                            {product.brand}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                  })}
                  {visible.length < products.length && (
                    <div className="px-4 py-3">
                      <button onClick={handleLoadMore} className="w-full rounded-xl py-2 text-sm font-semibold" style={{ color: "var(--brand)" }}>
                        Ver mais
                      </button>
                    </div>
                  )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                Não existem produtos relacionados para este artigo.
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
