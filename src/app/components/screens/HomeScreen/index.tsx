import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLists, ListResponse } from "../../../../api/useLists";
import { ApiError } from "../../../../api/useApi";
import { useProducts, Product } from "../../../../api/useProducts";
import { useStores, StoreResponse } from "../../../../api/useStores";
import { useAccounts } from "../../../../api/useAccounts";
import { usePrices, calculateDiscountPercentage } from "../../../../api/usePrices";
import { getProductImageSrc } from "../../../../lib/imageUtils";
import { ITEM_COLORS, RELATED_PRODUCTS_HOME_LIMIT, LIST_PREVIEW_ITEMS } from "../../../../lib/constants";
import { calculateListSavings, getBestPrice } from "../../../../lib/priceUtils";
import type { FavoriteDeal, HomeListItem } from "./types";
import { SummaryStats } from "./SummaryStats";
import { ListPreview } from "./ListPreview";
import { FavoriteDealsSection } from "./FavoriteDealsSection";
import { RelatedProductsSection } from "./RelatedProductsSection";

const LoadingBall = ({ size = 16 }: { size?: number }) => (
  <span
    className="inline-block rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"
    style={{ width: size, height: size }}
  />
);

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
  user?: { name?: string; email?: string; username?: string } | null;
  favoriteProductIds?: string[];
}

export function HomeScreen({ onNavigate, user, favoriteProductIds = [] }: HomeScreenProps) {
  const navigate = useNavigate();
  const { getLists, getList, updateList } = useLists();
  const { getProductsByIds, getRelatedProductsByFavoriteIds } = useProducts();
  const { getStores } = useStores();
  const { getMyFavoriteProductIds } = useAccounts();
  const { getPrices } = usePrices();

  const [quickAdd, setQuickAdd] = useState("");
  const [latestList, setLatestList] = useState<ListResponse | null>(null);
  const [totalListItems, setTotalListItems] = useState(0);
  const [myListItems, setMyListItems] = useState<HomeListItem[]>([]);
  const [favoriteDeals, setFavoriteDeals] = useState<FavoriteDeal[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoadingLatestList, setIsLoadingLatestList] = useState(false);
  const [isLoadingFavoriteDeals, setIsLoadingFavoriteDeals] = useState(false);
  const [isLoadingRelatedProducts, setIsLoadingRelatedProducts] = useState(false);
  const [savings, setSavings] = useState(0);
  const [togglePendingId, setTogglePendingId] = useState<number | null>(null);
  const [addPendingProductId, setAddPendingProductId] = useState<string | null>(null);

  const getListActionErrorMessage = useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      if (error.status === 428) return "Falta a versao da lista. Recarrega e tenta novamente.";
      if (error.status === 409) return "A lista foi alterada por outro utilizador. Recarrega e refaz o merge.";
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "Nao foi possivel atualizar a lista.";
  }, []);

  const isBusy = isLoadingLatestList || isLoadingFavoriteDeals || togglePendingId !== null || addPendingProductId !== null;

  const refreshLatestList = useCallback(async () => {
    setIsLoadingLatestList(true);
    try {
      const lists = await getLists();
      if (!lists?.length) {
        setLatestList(null); setTotalListItems(0); setMyListItems([]); setSavings(0);
        return;
      }

      setTotalListItems(lists.reduce((sum, l) => sum + l.items.reduce((s, i) => s + i.quantity, 0), 0));
      const allItems = lists.flatMap(l => (l.items ?? []).map(i => ({ productId: i.productId, storeId: i.storeId, quantity: i.quantity })));
      setSavings(await calculateListSavings(allItems, getPrices));

      const latest = [...lists].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      const currentList = latest?.id ? await getList(latest.id).catch(() => latest) : latest;
      setLatestList(currentList ?? null);

      const top = [...(currentList?.items || [])].sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1)).slice(0, LIST_PREVIEW_ITEMS);
      if (!top.length) { setMyListItems([]); return; }

      const productIds = Array.from(new Set(top.map(i => i.productId)));
      const storeIds = Array.from(new Set(top.map(i => i.storeId)));
      const productsMap: Record<string, Product> = {};
      const storesMap: Record<string, StoreResponse> = {};

      await Promise.allSettled([
        getProductsByIds(productIds).then(prods => prods.forEach(p => { productsMap[p.id] = p; })),
        getStores({ ids: storeIds.join(",") }).then(stores => stores.forEach(s => { storesMap[s.id] = s; })),
      ]);

      const priceByKey = new Map<string, ReturnType<typeof getBestPrice>>();
      await Promise.all(top.map(async item => {
        const key = `${item.productId}::${item.storeId}`;
        try { priceByKey.set(key, getBestPrice(await getPrices(item.productId, item.storeId))); }
        catch { priceByKey.set(key, { unitPrice: 0 }); }
      }));

      setMyListItems(top.map((item, idx) => {
        const product = productsMap[item.productId];
        const pricing = priceByKey.get(`${item.productId}::${item.storeId}`);
        return {
          ...item,
          name: product?.name || "Produto desconhecido",
          emoji: product?.emoji || "📦",
          imageSrc: product ? getProductImageSrc(product) : undefined,
          store: storesMap[item.storeId]?.name || "Loja desconhecida",
          color: ITEM_COLORS[idx % ITEM_COLORS.length],
          qty: `${item.quantity}x`,
          unitPrice: pricing?.unitPrice ?? 0,
          originalUnitPrice: pricing?.originalUnitPrice,
          discountPercent: pricing?.discountPercent,
        };
      }));
    } catch (error) {
      console.error(error);
      setLatestList(null); setTotalListItems(0); setMyListItems([]); setSavings(0);
    } finally {
      setIsLoadingLatestList(false);
    }
  }, [getList, getLists, getPrices, getProductsByIds, getStores]);

  useEffect(() => { void refreshLatestList(); }, [refreshLatestList]);

  useEffect(() => {
    async function fetchFavoriteDeals() {
      setIsLoadingFavoriteDeals(true);
      try {
        const favoriteIds = await getMyFavoriteProductIds();
        if (!favoriteIds.length) { setFavoriteDeals([]); return; }

        const products = await getProductsByIds(favoriteIds);
        const productsById = new Map(products.map(p => [p.id, p] as const));

        const discounts = (await Promise.all(
          favoriteIds.map(async id => {
            try {
              const prices = await getPrices(id);
              const discounted = prices.filter(p => typeof p.sale === "number" && p.sale > 0 && p.sale < p.price);
              if (!discounted.length) return null;
              const best = discounted.reduce((a, b) =>
                calculateDiscountPercentage(b.price, b.sale as number) > calculateDiscountPercentage(a.price, a.sale as number) ? b : a
              );
              return { productId: id, price: best.price, sale: best.sale as number, storeId: best.storeId };
            } catch { return null; }
          })
        )).filter((r): r is NonNullable<typeof r> => r !== null);

        if (!discounts.length) { setFavoriteDeals([]); return; }

        const storeIds = Array.from(new Set(discounts.map(d => d.storeId)));
        const stores = storeIds.length ? await getStores({ ids: storeIds.join(",") }) : [];
        const storesById = new Map(stores.map(s => [s.id, s.name] as const));

        setFavoriteDeals(
          discounts.flatMap((deal, i) => {
            const product = productsById.get(deal.productId);
            if (!product) return [];
            return [{
              id: product.id, name: product.name,
              discountPercent: calculateDiscountPercentage(deal.price, deal.sale),
              price: deal.sale, original: deal.price, storeId: deal.storeId,
              store: storesById.get(deal.storeId) || "Loja desconhecida",
              color: ITEM_COLORS[i % ITEM_COLORS.length],
              emoji: product.emoji || "📦",
              imageSrc: getProductImageSrc(product),
            }];
          }).sort((a, b) => b.discountPercent - a.discountPercent)
        );
      } catch (error) {
        console.error(error); setFavoriteDeals([]);
      } finally {
        setIsLoadingFavoriteDeals(false);
      }
    }
    fetchFavoriteDeals();
  }, [getMyFavoriteProductIds, getProductsByIds, getPrices, getStores]);

  useEffect(() => {
    if (!favoriteProductIds.length) { setRelatedProducts([]); return; }
    setIsLoadingRelatedProducts(true);
    getRelatedProductsByFavoriteIds(favoriteProductIds, RELATED_PRODUCTS_HOME_LIMIT)
      .then(setRelatedProducts)
      .catch(() => setRelatedProducts([]))
      .finally(() => setIsLoadingRelatedProducts(false));
  }, [favoriteProductIds, getRelatedProductsByFavoriteIds]);

  const handleToggleItem = async (id: number) => {
    if (!latestList) return;
    setTogglePendingId(id);
    setMyListItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
    const updatedItems = latestList.items.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
    setLatestList(prev => prev ? { ...prev, items: updatedItems } : null);
    try {
      const updatedList = await updateList(latestList.id, latestList.version, undefined, updatedItems.map(i => ({ productId: i.productId, storeId: i.storeId, quantity: i.quantity, checked: i.checked })));
      setLatestList(updatedList);
    } catch (e) {
      console.error(e);
      window.alert(getListActionErrorMessage(e));
      await refreshLatestList();
    }
    finally { setTogglePendingId(null); }
  };

  const handleAddDealToList = async (deal: FavoriteDeal) => {
    if (!latestList) return;
    setAddPendingProductId(deal.id);
    try {
      const existing = latestList.items.find(i => i.productId === deal.id && i.storeId === deal.storeId);
      const updatedItems = existing
        ? latestList.items.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...latestList.items, { id: Date.now(), productId: deal.id, storeId: deal.storeId, quantity: 1, checked: false }];
      const updatedList = await updateList(latestList.id, latestList.version, undefined, updatedItems.map(i => ({ productId: i.productId, storeId: i.storeId, quantity: i.quantity, checked: i.checked })));
      setLatestList(updatedList);
      await refreshLatestList();
    } catch (error) {
      console.error(error);
      window.alert(getListActionErrorMessage(error));
      await refreshLatestList();
    }
    finally { setAddPendingProductId(null); }
  };

  return (
    <div className="flex min-h-full flex-col bg-page overflow-x-hidden">
      <div className="px-5 pt-6 pb-5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400" style={{ fontSize: 13 }}>Bom dia 👋</p>
            <h1 className="text-gray-900" style={{ fontSize: 22, fontWeight: 700 }}>
              {user?.name ? `Bem-vindo de volta, ${user.name}!` : "Bem-vindo ao Shopisel!"}
            </h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center" onClick={() => onNavigate("profile")}>
            <span className="text-white" style={{ fontSize: 14, fontWeight: 700 }}>
              {user?.name?.trim()?.charAt(0).toUpperCase() || "U"}
            </span>
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input value={quickAdd} onChange={e => setQuickAdd(e.target.value)} placeholder="Adicionar rapidamente à lista..." className="flex-1 bg-transparent outline-none text-gray-700" style={{ fontSize: 14 }} />
          </div>
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => onNavigate("lists")} className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
            <Plus className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isBusy && (
          <div className="px-5 pt-3 flex items-center gap-2 text-indigo-600">
            <LoadingBall size={14} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>A carregar...</span>
          </div>
        )}
        <SummaryStats totalListItems={totalListItems} savings={savings} />
        <ListPreview listName={latestList?.name ?? null} items={myListItems} isLoading={isLoadingLatestList} onViewAll={() => latestList ? navigate(`/lists/${latestList.id}`) : onNavigate("lists")} onToggleItem={id => void handleToggleItem(id)} />
        <FavoriteDealsSection deals={favoriteDeals} isLoading={isLoadingFavoriteDeals} latestList={latestList} addPendingProductId={addPendingProductId} onViewAll={() => navigate("/profile/favorites")} onAddToList={deal => void handleAddDealToList(deal)} />
        <RelatedProductsSection products={relatedProducts} isLoading={isLoadingRelatedProducts} onViewAll={() => onNavigate("prices")} />
      </div>
    </div>
  );
}
