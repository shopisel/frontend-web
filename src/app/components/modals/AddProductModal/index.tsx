import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Type, Grid3x3, ChevronLeft } from "lucide-react";
import { useProducts, Product, Category } from "../../../../api/useProducts";
import { useStores, StoreResponse } from "../../../../api/useStores";
import { usePrices, PriceResponse } from "../../../../api/usePrices";
import { normalizeImageName } from "../../../../lib/imageUtils";
import { PRODUCTS_PAGE_SIZE_MODAL as PRODUCTS_PAGE_SIZE, DEBOUNCE_SEARCH_MS, DEBOUNCE_STORE_SEARCH_MS } from "../../../../lib/constants";
import { ProductList } from "./ProductList";
import { CategoryGrid } from "./CategoryGrid";
import { StoreSelector } from "./StoreSelector";

type InputMethod = "text" | "category";

export interface AddItemPayload {
  productId: string;
  storeId: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  checked: boolean;
  name: string;
  brand?: string;
  emoji: string;
  storeName: string;
}

const categoryImageModules = import.meta.glob("../../../../../image/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const categoryImageByName = Object.entries(categoryImageModules).reduce<Record<string, string>>(
  (acc, [path, url]) => {
    const fileName = path.split(/[/\\]/).pop() ?? "";
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    if (baseName) acc[normalizeImageName(baseName)] = url;
    return acc;
  },
  {},
);

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: AddItemPayload) => void;
}

export function AddProductModal({ isOpen, onClose, onAddItem }: AddProductModalProps) {
  const { searchProducts, getMainCategories, getSubCategories, getProductsByCategory } = useProducts();
  const { getStores } = useStores();
  const { getPrices } = usePrices();

  const [method, setMethod] = useState<InputMethod>("text");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedCount, setAddedCount] = useState(0);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [storeSearch, setStoreSearch] = useState("");
  const [allStores, setAllStores] = useState<StoreResponse[]>([]);
  const [productPrices, setProductPrices] = useState<PriceResponse[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingStore, setIsLoadingStore] = useState(false);

  const getCategoryImageSrc = (category: Category) => {
    const imageValue = category.image?.trim();
    if (imageValue && /^(https?:|data:|blob:|\/)/i.test(imageValue)) return imageValue;
    const rawName = imageValue || category.name;
    if (!rawName) return undefined;
    return categoryImageByName[normalizeImageName(rawName.replace(/\.[^/.]+$/, ""))];
  };

  useEffect(() => {
    if (method === "category" && categories.length === 0) {
      setIsLoading(true);
      getMainCategories().then(data => setCategories(data || [])).catch(console.error).finally(() => setIsLoading(false));
    }
  }, [method, categories.length, getMainCategories]);

  useEffect(() => {
    const query = searchInput.trim();
    if (!query || method !== "text") return;
    const timer = setTimeout(async () => {
      setIsLoading(true); setHasMore(false); setIsLoadingMore(false);
      try {
        const data = await searchProducts(query, PRODUCTS_PAGE_SIZE, 0);
        setProducts(data || []); setHasMore((data || []).length === PRODUCTS_PAGE_SIZE);
      } catch (e) { console.error(e); setHasMore(false); }
      finally { setIsLoading(false); }
    }, DEBOUNCE_SEARCH_MS);
    return () => clearTimeout(timer);
  }, [searchInput, method, searchProducts]);

  useEffect(() => {
    if (!selectedCategory) {
      if (method === "category") { setSubCategories([]); setProducts([]); setHasMore(false); }
      return;
    }
    setIsLoading(true);
    setSelectedSubCategory(null); setSubCategories([]); setProducts([]); setHasMore(false); setIsLoadingMore(false);
    getSubCategories(selectedCategory.id).then(data => setSubCategories(data || [])).catch(console.error).finally(() => setIsLoading(false));
  }, [selectedCategory, getSubCategories, method]);

  useEffect(() => {
    if (!selectedSubCategory) {
      if (selectedCategory && method === "category") { setProducts([]); setHasMore(false); }
      return;
    }
    setIsLoading(true); setHasMore(false); setIsLoadingMore(false);
    getProductsByCategory(selectedSubCategory.id, PRODUCTS_PAGE_SIZE, 0)
      .then(data => { setProducts(data || []); setHasMore((data || []).length === PRODUCTS_PAGE_SIZE); })
      .catch(console.error).finally(() => setIsLoading(false));
  }, [selectedSubCategory, getProductsByCategory, method, selectedCategory]);

  useEffect(() => {
    if (!selectedProduct) return;
    setStoreSearch(""); setIsLoadingStore(true);
    getPrices(selectedProduct.id).then(async prices => {
      setProductPrices(prices || []);
      if (prices?.length) {
        const stores = await getStores({ ids: prices.map(p => p.storeId).join(",") });
        setAllStores(stores || []);
      } else { setAllStores([]); }
    }).catch(console.error).finally(() => setIsLoadingStore(false));
  }, [selectedProduct, getStores, getPrices]);

  useEffect(() => {
    if (!selectedProduct || !storeSearch.trim()) return;
    const timer = setTimeout(() => {
      setIsLoadingStore(true);
      getStores({ name: storeSearch.trim() }).then(stores => setAllStores(stores || [])).catch(console.error).finally(() => setIsLoadingStore(false));
    }, DEBOUNCE_STORE_SEARCH_MS);
    return () => clearTimeout(timer);
  }, [storeSearch, selectedProduct, getStores]);

  const loadMore = async () => {
    if (isLoading || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      if (method === "text" && searchInput.trim()) {
        const data = await searchProducts(searchInput.trim(), PRODUCTS_PAGE_SIZE, products.length);
        setProducts(prev => [...prev, ...(data || [])]); setHasMore((data || []).length === PRODUCTS_PAGE_SIZE);
      } else if (method === "category" && selectedSubCategory) {
        const data = await getProductsByCategory(selectedSubCategory.id, PRODUCTS_PAGE_SIZE, products.length);
        setProducts(prev => [...prev, ...(data || [])]); setHasMore((data || []).length === PRODUCTS_PAGE_SIZE);
      }
    } catch (e) { console.error(e); }
    finally { setIsLoadingMore(false); }
  };

  const handleReset = () => {
    setMethod("text"); setSearchInput(""); setSelectedCategory(null);
    setSelectedSubCategory(null); setSelectedProduct(null); setAddedCount(0);
    setProducts([]); setSubCategories([]);
  };

  const handleClose = () => { handleReset(); onClose(); };

  const handleStoreSelect = (store: StoreResponse) => {
    if (!selectedProduct) return;
    const known = productPrices.find(p => p.storeId === store.id);
    const hasSale = typeof known?.sale === "number" && known.sale > 0;
    const price = known ? (hasSale ? known.sale as number : known.price) : 0;
    onAddItem({
      productId: selectedProduct.id, storeId: store.id, quantity: 1,
      price, originalPrice: hasSale ? known?.price : undefined,
      checked: false, name: selectedProduct.name,
      brand: selectedProduct.brand ?? undefined,
      emoji: selectedProduct.emoji || "📦",
      storeName: store.name,
    });
    setAddedCount(prev => prev + 1);
    setTimeout(() => setSelectedProduct(null), 400);
  };

  const goBack = () => {
    if (selectedProduct) setSelectedProduct(null);
    else if (selectedSubCategory) setSelectedSubCategory(null);
    else if (selectedCategory) setSelectedCategory(null);
  };

  if (!isOpen) return null;

  const hasBackButton = !!(selectedCategory || selectedSubCategory || selectedProduct);
  const title = selectedProduct ? "Escolher Loja"
    : selectedSubCategory ? selectedSubCategory.name
    : selectedCategory ? selectedCategory.name
    : "Adicionar Produto";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }} transition={{ duration: 0.2 }}
        className="w-full sm:max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[90dvh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {hasBackButton && (
              <button onClick={goBack} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
            )}
            <div className="min-w-0">
              <h2 className="text-gray-900 truncate text-lg font-bold">{title}</h2>
              {addedCount > 0 && !selectedProduct && (
                <p className="text-green-600 text-xs font-semibold">
                  {addedCount} {addedCount === 1 ? "artigo adicionado" : "artigos adicionados"}
                </p>
              )}
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {selectedProduct ? (
            <AnimatePresence mode="wait">
              <StoreSelector product={selectedProduct} stores={allStores} prices={productPrices} storeSearch={storeSearch} isLoading={isLoadingStore} onSearchChange={setStoreSearch} onSelect={handleStoreSelect} />
            </AnimatePresence>
          ) : (
            <>
              {!selectedCategory && (
                <div className="flex gap-2 mb-4">
                  <button onClick={() => setMethod("text")} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all text-sm font-semibold" style={{ backgroundColor: method === "text" ? "var(--brand-light)" : "#F3F4F6", color: method === "text" ? "var(--brand)" : "#6B7280" }}>
                    <Type className="w-4 h-4" /> Pesquisar
                  </button>
                  <button onClick={() => setMethod("category")} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all text-sm font-semibold" style={{ backgroundColor: method === "category" ? "var(--success-light)" : "#F3F4F6", color: method === "category" ? "var(--success)" : "#6B7280" }}>
                    <Grid3x3 className="w-4 h-4" /> Categoria
                  </button>
                </div>
              )}
              <AnimatePresence mode="wait">
                {method === "text" && !selectedCategory && (
                  <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 mb-3">
                      <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Pesquisar por nome..." autoFocus className="flex-1 bg-transparent outline-none text-gray-900 text-sm" />
                    </div>
                    <ProductList products={products} isLoading={isLoading} isLoadingMore={isLoadingMore} hasMore={hasMore} emptyMessage={searchInput.length > 0 ? "Nenhum produto encontrado." : undefined} onSelect={setSelectedProduct} onLoadMore={() => void loadMore()} />
                  </motion.div>
                )}
                {method === "category" && !selectedCategory && (
                  <motion.div key="category" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <CategoryGrid categories={categories} isLoading={isLoading} getImageSrc={getCategoryImageSrc} onSelect={cat => { setSelectedCategory(cat); setSelectedSubCategory(null); setSubCategories([]); setProducts([]); }} />
                  </motion.div>
                )}
                {method === "category" && selectedCategory && !selectedSubCategory && (
                  <motion.div key={`sub-${selectedCategory.id}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <CategoryGrid categories={subCategories} isLoading={isLoading} getImageSrc={getCategoryImageSrc} onSelect={setSelectedSubCategory} />
                  </motion.div>
                )}
                {selectedSubCategory && (
                  <motion.div key={`prod-${selectedSubCategory.id}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <ProductList products={products} isLoading={isLoading} isLoadingMore={isLoadingMore} hasMore={hasMore} onSelect={setSelectedProduct} onLoadMore={() => void loadMore()} />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
