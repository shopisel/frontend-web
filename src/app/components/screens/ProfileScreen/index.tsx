import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import type { Product } from "../../../../api/useProducts";
import { useStores } from "../../../../api/useStores";
import type { StoreResponse } from "../../../../api/useStores";
import { useLists } from "../../../../api/useLists";
import { usePrices } from "../../../../api/usePrices";
import { calculateListSavings } from "../../../../lib/priceUtils";
import { UserCard } from "./UserCard";
import { StorePreferences } from "./StorePreferences";
import { AccountSettings } from "./AccountSettings";
import { FavoritesTab } from "./FavoritesTab";

interface ProfileScreenProps {
  onLogout: () => void;
  user?: { name?: string; email?: string; username?: string } | null;
  favoriteProducts: Product[];
  favoritesLoading: boolean;
  favoritesError: string | null;
  onReloadFavorites: () => Promise<void>;
  onToggleFavorite: (product: Product) => Promise<void>;
  initialTab?: "settings" | "favorites";
}

export function ProfileScreen({
  onLogout, user, favoriteProducts, favoritesLoading, favoritesError,
  onReloadFavorites, onToggleFavorite, initialTab = "settings",
}: ProfileScreenProps) {
  const [favoritePendingId, setFavoritePendingId] = useState<string | null>(null);
  const [onlineStores, setOnlineStores] = useState<(StoreResponse & { active: boolean })[]>([]);
  const [listCount, setListCount] = useState(0);
  const [savings, setSavings] = useState(0);

  const { getStores } = useStores();
  const { getLists } = useLists();
  const { getPrices } = usePrices();

  useEffect(() => {
    void (async () => {
      try {
        const all = await getStores();
        setOnlineStores(all.filter(s => s.latitude == null && s.longitude == null).map(s => ({ ...s, active: true })));
      } catch {}
    })();
  }, [getStores]);

  useEffect(() => {
    void (async () => {
      try {
        const lists = await getLists();
        setListCount(lists.length);
        const allItems = lists.flatMap(l => (l.items ?? []).map(i => ({ productId: i.productId, storeId: i.storeId, quantity: i.quantity })));
        setSavings(await calculateListSavings(allItems, getPrices));
      } catch {}
    })();
  }, [getLists, getPrices]);

  const handleToggleFavorite = async (product: Product) => {
    setFavoritePendingId(product.id);
    try { await onToggleFavorite(product); }
    finally { setFavoritePendingId(null); }
  };

  const displayName = user?.name || user?.username || "Utilizador";
  const displayEmail = user?.email || "Sem email";
  const initials = displayName.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");

  return (
    <div className="flex min-h-full flex-col bg-page overflow-x-hidden">
      <UserCard displayName={displayName} displayEmail={displayEmail} initials={initials} listCount={listCount} savings={savings} />

      <div className="px-5 py-4">
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="w-full h-11 bg-gray-100">
            <TabsTrigger value="settings">Definições</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          </TabsList>
          <TabsContent value="settings" className="mt-4">
            <div className="flex flex-col gap-4">
              <StorePreferences stores={onlineStores} onToggle={i => setOnlineStores(prev => prev.map((s, idx) => idx === i ? { ...s, active: !s.active } : s))} />
              <AccountSettings username={user?.username} email={user?.email} onLogout={onLogout} />
            </div>
          </TabsContent>
          <TabsContent value="favorites" className="mt-4">
            <FavoritesTab products={favoriteProducts} isLoading={favoritesLoading} error={favoritesError} pendingId={favoritePendingId} onReload={() => void onReloadFavorites()} onToggle={p => void handleToggleFavorite(p)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
