import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts, type Category, type Product } from "../../../../api/useProducts";
import { usePrices, type PriceResponse } from "../../../../api/usePrices";
import { useStores } from "../../../../api/useStores";
import { PRODUCTS_PAGE_SIZE, DEBOUNCE_SEARCH_MS } from "../../../../lib/constants";
import { CategoryFilter } from "./CategoryFilter";
import { ProductSelector } from "./ProductSelector";
import { ProductDetailCard } from "./ProductDetailCard";
import { RelatedProductsDrawer } from "./RelatedProductsDrawer";
import { StoreList } from "./StoreList";
import { AddToListSheet } from "./AddToListSheet";
import type { StoreRow } from "./types";

const getEffectivePrice = (price: PriceResponse) =>
  typeof price.sale === "number" && price.sale > 0 ? price.sale : price.price;

type PricesScreenProps = {
  favoriteProductIds: string[];
  onToggleFavorite: (product: Product) => Promise<void>;
};

export function PricesScreen({ favoriteProductIds, onToggleFavorite }: PricesScreenProps) {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId?: string }>();
  const { searchProducts, getMainCategories, getSubCategories, getProductsByCategory, getProductsByIds, getRelatedProductsByFavoriteIds } = useProducts();
  const { getPrices } = usePrices();
  const { getStores } = useStores();

  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [selectedMainCat, setSelectedMainCat] = useState<Category | null>(null);
  const [selectedSubCat, setSelectedSubCat] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [storeRows, setStoreRows] = useState<StoreRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "distance">("price");
  const [mapView, setMapView] = useState(false);
  const [isRelatedDrawerOpen, setIsRelatedDrawerOpen] = useState(false);
  const [isLoadingCats, setIsLoadingCats] = useState(false);
  const [isLoadingSubCats, setIsLoadingSubCats] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingMoreProducts, setIsLoadingMoreProducts] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);
  const [isLoadingRelatedProducts, setIsLoadingRelatedProducts] = useState(false);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [favoritePendingId, setFavoritePendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addToListOpen, setAddToListOpen] = useState(false);

  const resetCategorySelection = () => { setSelectedMainCat(null); setSelectedSubCat(null); setSubCategories([]); };
  const resetProductSelection = () => {
    setProducts([]);
    setSelectedProduct(null);
    setStoreRows([]);
    setHasMoreProducts(false);
    setIsLoadingMoreProducts(false);
    setIsRelatedDrawerOpen(false);
  };

  const selectProduct = (product: Product, options?: { replace?: boolean }) => {
    setSelectedProduct(product);
    setProducts(prev => (prev.some(p => p.id === product.id) ? prev : [product, ...prev]));
    void navigate(`/prices/${product.id}`, { replace: options?.replace ?? false });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      resetCategorySelection();
      resetProductSelection();
      void navigate("/prices", { replace: true });
    }
  };

  const handleSelectMainCategory = (cat: Category | null) => {
    if (searchQuery.trim()) setSearchQuery("");
    void navigate("/prices", { replace: true });
    setSelectedMainCat(cat);
  };

  const handleSelectSubCategory = (cat: Category) => {
    if (searchQuery.trim()) setSearchQuery("");
    void navigate("/prices", { replace: true });
    setSelectedSubCat(cat);
  };

  const handleSelectRelatedProduct = (rp: Product) => {
    selectProduct(rp);
  };

  useEffect(() => {
    let cancelled = false;
    setIsLoadingCats(true); setError(null);
    getMainCategories()
      .then(data => { if (!cancelled) setMainCategories(data || []); })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : "Erro ao carregar categorias"); })
      .finally(() => { if (!cancelled) setIsLoadingCats(false); });
    return () => { cancelled = true; };
  }, [getMainCategories]);

  useEffect(() => {
    let cancelled = false;
    setSelectedSubCat(null); setSubCategories([]); resetProductSelection();
    if (!selectedMainCat) return;
    setIsLoadingSubCats(true); setError(null);
    getSubCategories(selectedMainCat.id)
      .then(data => { if (!cancelled) setSubCategories(data || []); })
      .catch(e => { if (!cancelled) { setError(e instanceof Error ? e.message : "Erro"); setSubCategories([]); } })
      .finally(() => { if (!cancelled) setIsLoadingSubCats(false); });
    return () => { cancelled = true; };
  }, [selectedMainCat, getSubCategories]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsLoadingProducts(true); setHasMoreProducts(false); setError(null);
      try {
        const data = await searchProducts(query, PRODUCTS_PAGE_SIZE, 0);
        if (!cancelled) { setProducts(data || []); setHasMoreProducts((data || []).length === PRODUCTS_PAGE_SIZE); }
      } catch (e) {
        if (!cancelled) { setError(e instanceof Error ? e.message : "Erro"); setProducts([]); setHasMoreProducts(false); }
      } finally { if (!cancelled) setIsLoadingProducts(false); }
    }, DEBOUNCE_SEARCH_MS);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [searchQuery, searchProducts]);

  useEffect(() => {
    if (searchQuery.trim()) return;
    let cancelled = false;
    resetProductSelection();
    if (!selectedSubCat) return;
    setIsLoadingProducts(true); setHasMoreProducts(false); setError(null);
    getProductsByCategory(selectedSubCat.id, PRODUCTS_PAGE_SIZE, 0)
      .then(data => { if (!cancelled) { setProducts(data || []); setHasMoreProducts((data || []).length === PRODUCTS_PAGE_SIZE); } })
      .catch(e => { if (!cancelled) { setError(e instanceof Error ? e.message : "Erro"); setProducts([]); setHasMoreProducts(false); } })
      .finally(() => { if (!cancelled) setIsLoadingProducts(false); });
    return () => { cancelled = true; };
  }, [selectedSubCat, searchQuery, getProductsByCategory]);

  useEffect(() => {
    if (!selectedProduct) { setRelatedProducts([]); return; }
    let cancelled = false;
    setIsLoadingRelatedProducts(true);
    getRelatedProductsByFavoriteIds([selectedProduct.id])
      .then(data => { if (!cancelled) setRelatedProducts((data || []).filter(p => p.id !== selectedProduct.id)); })
      .catch(() => { if (!cancelled) setRelatedProducts([]); })
      .finally(() => { if (!cancelled) setIsLoadingRelatedProducts(false); });
    return () => { cancelled = true; };
  }, [selectedProduct, getRelatedProductsByFavoriteIds]);

  useEffect(() => {
    let cancelled = false;

    if (productId) {
      const match = products.find(p => p.id === productId);
      if (match) {
        if (selectedProduct?.id !== match.id) setSelectedProduct(match);
        return () => { cancelled = true; };
      }

      (async () => {
        try {
          const data = await getProductsByIds([productId]);
          const found = data?.[0] ?? null;
          if (!cancelled && found) {
            setProducts(prev => (prev.some(p => p.id === found.id) ? prev : [found, ...prev]));
            setSelectedProduct(found);
          }
        } catch {
          if (!cancelled) setSelectedProduct(null);
        }
      })();

      return () => { cancelled = true; };
    }

    return () => { cancelled = true; };
  }, [productId, products, selectedProduct, getProductsByIds, navigate]);

  const loadMoreProducts = async () => {
    if (isLoadingProducts || isLoadingMoreProducts || !hasMoreProducts) return;
    const query = searchQuery.trim();
    setIsLoadingMoreProducts(true); setError(null);
    try {
      if (query) {
        const data = await searchProducts(query, PRODUCTS_PAGE_SIZE, products.length);
        setProducts(prev => [...prev, ...(data || [])]); setHasMoreProducts((data || []).length === PRODUCTS_PAGE_SIZE);
      } else if (selectedSubCat) {
        const data = await getProductsByCategory(selectedSubCat.id, PRODUCTS_PAGE_SIZE, products.length);
        setProducts(prev => [...prev, ...(data || [])]); setHasMoreProducts((data || []).length === PRODUCTS_PAGE_SIZE);
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Erro ao carregar mais"); }
    finally { setIsLoadingMoreProducts(false); }
  };

  useEffect(() => {
    if (!selectedProduct) { setStoreRows([]); return; }
    let cancelled = false;
    setIsLoadingStores(true); setError(null);
    (async () => {
      try {
        const pricesRes = await getPrices(selectedProduct.id);
        const storeIds = Array.from(new Set((pricesRes || []).map(p => p.storeId)));
        const storesRes = storeIds.length ? await getStores({ ids: storeIds.join(",") }) : [];
        const storeNameById = new Map((storesRes || []).map(s => [s.id, s.name] as const));
        const rows: StoreRow[] = (pricesRes || []).map(p => ({
          id: p.storeId, name: storeNameById.get(p.storeId) ?? p.storeId,
          price: getEffectivePrice(p), originalPrice: p.price,
          sale: p.sale, quantityText: p.quantityText, unitPriceText: p.unitPriceText,
        }));
        if (!cancelled) setStoreRows(rows);
      } catch (e) {
        if (!cancelled) { setError(e instanceof Error ? e.message : "Erro ao carregar preços"); setStoreRows([]); }
      } finally { if (!cancelled) setIsLoadingStores(false); }
    })();
    return () => { cancelled = true; };
  }, [selectedProduct, getPrices, getStores]);

  const sortedStores = useMemo(() => [...storeRows].sort((a, b) =>
    sortBy === "price" ? a.price - b.price : (a.distKm ?? 0) - (b.distKm ?? 0)
  ), [storeRows, sortBy]);

  const maxPromoSaving = useMemo(() => storeRows.reduce((max, store) => {
    if (typeof store.sale === "number" && store.sale > 0 && store.sale < store.originalPrice)
      return Math.max(max, store.originalPrice - store.sale);
    return max;
  }, 0), [storeRows]);

  const selectedProductFavorite = selectedProduct ? favoriteProductIds.includes(selectedProduct.id) : false;
  const selectedUnitPriceText = useMemo(() => sortedStores.find(row => Boolean(row.unitPriceText?.trim()))?.unitPriceText?.trim() || "", [sortedStores]);

  const handleToggleFavorite = async (product: Product) => {
    setFavoritePendingId(product.id);
    try { await onToggleFavorite(product); }
    finally { setFavoritePendingId(null); }
  };

  return (
    <div className="flex min-h-full flex-col bg-page overflow-x-hidden">
      <div className="px-5 pt-12 pb-4 bg-white">
        <h1 className="text-gray-900 mb-1" style={{ fontSize: 24, fontWeight: 700 }}>Comparar Preços</h1>
        <p className="text-gray-400 mb-4" style={{ fontSize: 14 }}>Encontra as melhores ofertas perto de ti</p>
        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input value={searchQuery} onChange={e => handleSearchChange(e.target.value)} placeholder="Pesquisar produto..." className="flex-1 bg-transparent outline-none text-gray-700" style={{ fontSize: 14 }} />
        </div>
      </div>

      <CategoryFilter mainCategories={mainCategories} selectedMainCat={selectedMainCat} isLoadingCats={isLoadingCats} subCategories={subCategories} selectedSubCat={selectedSubCat} isLoadingSubCats={isLoadingSubCats} onSelectMainCategory={handleSelectMainCategory} onSelectSubCategory={handleSelectSubCategory} />

      <div className="flex-1 overflow-y-auto">
        {error && <div className="px-5 pt-3 text-red-500 text-xs font-semibold">{error}</div>}
        <ProductSelector
          products={products}
          selectedProduct={selectedProduct}
          favoriteProductIds={favoriteProductIds}
          isLoadingProducts={isLoadingProducts}
          isLoadingMoreProducts={isLoadingMoreProducts}
          hasMoreProducts={hasMoreProducts}
          searchQuery={searchQuery}
          selectedMainCat={selectedMainCat}
          selectedSubCat={selectedSubCat}
          onSelectProduct={product => selectProduct(product)}
          onLoadMore={() => void loadMoreProducts()}
        />
        <ProductDetailCard
          selectedProduct={selectedProduct}
          selectedMainCat={selectedMainCat}
          selectedSubCat={selectedSubCat}
          sortedStores={sortedStores}
          selectedUnitPriceText={selectedUnitPriceText}
          maxPromoSaving={maxPromoSaving}
          relatedProductsCount={relatedProducts.length}
          selectedProductFavorite={selectedProductFavorite}
          favoritePendingId={favoritePendingId}
          onToggleFavorite={p => void handleToggleFavorite(p)}
          onOpenRelatedProducts={() => setIsRelatedDrawerOpen(true)}
          onAddToList={() => setAddToListOpen(true)}
        />
        <StoreList sortedStores={sortedStores} selectedProduct={selectedProduct} isLoadingStores={isLoadingStores} sortBy={sortBy} mapView={mapView} onChangeSortBy={setSortBy} onToggleMapView={() => setMapView(v => !v)} />
      </div>

      <RelatedProductsDrawer
        open={isRelatedDrawerOpen}
        isLoading={isLoadingRelatedProducts}
        products={relatedProducts}
        onOpenChange={setIsRelatedDrawerOpen}
        onSelectProduct={handleSelectRelatedProduct}
      />

      <AddToListSheet
        product={selectedProduct}
        bestStore={sortedStores[0] ?? null}
        isOpen={addToListOpen}
        onClose={() => setAddToListOpen(false)}
      />
    </div>
  );
}
