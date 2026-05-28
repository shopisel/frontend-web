import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  LogOut, Star, Store, User, Loader, RotateCcw, KeyRound, Pencil,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import type { Product } from "../../../api/useProducts";
import { ImageWithFallback } from "../fallback/ImageWithFallback";
import { keycloak } from "../../../auth/keycloak";
import { useStores } from "../../../api/useStores";
import type { StoreResponse } from "../../../api/useStores";
import { useLists } from "../../../api/useLists";
import { usePrices } from "../../../api/usePrices";

interface ProfileScreenProps {
  onLogout: () => void;
  user?: {
    name?: string;
    email?: string;
    username?: string;
  } | null;
  favoriteProducts: Product[];
  favoritesLoading: boolean;
  favoritesError: string | null;
  onReloadFavorites: () => Promise<void>;
  onToggleFavorite: (product: Product) => Promise<void>;
  initialTab?: "settings" | "favorites";
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ backgroundColor: value ? "#6366F1" : "#D1D5DB" }}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        animate={{ left: value ? "calc(100% - 20px)" : "4px" }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </button>
  );
}


const getProductImageSrc = (product: Product) => {
  const imageValue = product.image?.trim();
  if (!imageValue) return undefined;
  if (/^(https?:|data:|blob:|\/)/i.test(imageValue)) return imageValue;
  return undefined;
};

export function ProfileScreen({
  onLogout,
  user,
  favoriteProducts,
  favoritesLoading,
  favoritesError,
  onReloadFavorites,
  onToggleFavorite,
  initialTab = "settings",
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
        const online = all.filter(s => s.latitude == null && s.longitude == null);
        setOnlineStores(online.map(s => ({ ...s, active: true })));
      } catch {}
    })();
  }, [getStores]);

  useEffect(() => {
    void (async () => {
      try {
        const lists = await getLists();
        setListCount(lists.length);

        const allItems: { productId: string; storeId: string; quantity: number }[] = [];
        for (const list of lists) {
          for (const item of list.items ?? []) {
            allItems.push({ productId: item.productId, storeId: item.storeId, quantity: item.quantity });
          }
        }

        const uniquePairs = new Map<string, { productId: string; storeId: string }>();
        for (const item of allItems) {
          const key = `${item.productId}:${item.storeId}`;
          if (!uniquePairs.has(key)) uniquePairs.set(key, { productId: item.productId, storeId: item.storeId });
        }

        const priceMap = new Map<string, { price: number; sale?: number }>();
        await Promise.all(
          Array.from(uniquePairs.values()).map(async ({ productId, storeId }) => {
            try {
              const prices = await getPrices(productId, storeId);
              if (prices.length > 0) {
                priceMap.set(`${productId}:${storeId}`, { price: prices[0].price, sale: prices[0].sale });
              }
            } catch {}
          })
        );

        let total = 0;
        for (const item of allItems) {
          const p = priceMap.get(`${item.productId}:${item.storeId}`);
          if (p?.sale != null && p.sale > 0 && p.sale < p.price) {
            total += (p.price - p.sale) * item.quantity;
          }
        }
        setSavings(total);
      } catch {}
    })();
  }, [getLists, getPrices]);

  const toggleStore = (idx: number) => {
    setOnlineStores(prev => prev.map((s, i) => i === idx ? { ...s, active: !s.active } : s));
  };

  const displayName = user?.name || user?.username || "Utilizador";
  const displayEmail = user?.email || "Sem email";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC] overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-6 pb-6 bg-white">
        <h1 className="text-gray-900 mb-4" style={{ fontSize: 24, fontWeight: 700 }}>Perfil</h1>

        {/* User card */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl">
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

        {/* Stats row */}
        <div className="flex gap-3 mt-4">
          {[
            { label: "Listas", value: String(listCount) },
            { label: "Poupado", value: `€${savings.toFixed(2)}` },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 bg-gray-50 rounded-2xl p-3 text-center">
              <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 800 }}>{stat.value}</p>
              <p className="text-gray-400" style={{ fontSize: 12 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="w-full h-11 bg-gray-100">
            <TabsTrigger value="settings">Definições</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-4">
            <div className="flex flex-col gap-4">
              {/* Preferred stores */}
              <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Store className="w-4 h-4 text-indigo-600" />
                  <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Lojas Preferidas</p>
                </div>
                <div className="flex flex-col gap-2.5">
                  {onlineStores.length === 0 ? (
                    <p className="text-gray-400" style={{ fontSize: 13 }}>Nenhuma loja online disponível.</p>
                  ) : onlineStores.map((store, i) => (
                    <div key={store.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: store.active ? "#EEF2FF" : "#F9FAFB" }}
                        >
                          <Store className="w-4 h-4" style={{ color: store.active ? "#6366F1" : "#D1D5DB" }} />
                        </div>
                        <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{store.name}</p>
                      </div>
                      <Toggle value={store.active} onChange={() => toggleStore(i)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dados da Conta */}
              <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-indigo-600" />
                  <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Dados da Conta</p>
                </div>

                <div className="mb-3">
                  <p className="text-gray-400 mb-1" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Nome de utilizador
                  </p>
                  <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 600 }}>
                    {user?.username || "—"}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-400 mb-1" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    E-mail
                  </p>
                  <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 600 }}>
                    {user?.email || "—"}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => void keycloak?.login({ action: "UPDATE_PASSWORD" })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ backgroundColor: "#EEF2FF" }}
                  >
                    <KeyRound className="w-4 h-4 text-indigo-600" />
                    <span className="text-indigo-700" style={{ fontSize: 13, fontWeight: 600 }}>
                      Alterar palavra-passe
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void keycloak?.accountManagement()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ backgroundColor: "#F9FAFB" }}
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>
                      Editar perfil
                    </span>
                  </button>
                </div>
              </div>

              {/* Logout */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onLogout}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 bg-red-50 mb-6"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-red-500" style={{ fontSize: 14, fontWeight: 600 }}>Terminar Sessão</span>
              </motion.button>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-4">
            <div className="bg-white rounded-3xl p-4 mb-6" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" fill="#F59E0B" />
                  <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Produtos favoritos</p>
                </div>
                <button
                  type="button"
                  onClick={() => void onReloadFavorites()}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 flex items-center gap-1.5"
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Atualizar
                </button>
              </div>

              {favoritesLoading ? (
                <div className="flex items-center gap-2 text-gray-400 py-4">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>A carregar favoritos...</span>
                </div>
              ) : favoritesError ? (
                <div className="text-red-500 py-2" style={{ fontSize: 12, fontWeight: 600 }}>
                  {favoritesError}
                </div>
              ) : favoriteProducts.length === 0 ? (
                <div className="text-gray-400 py-4" style={{ fontSize: 13, fontWeight: 600 }}>
                  Ainda nao tens produtos favoritos.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {favoriteProducts.map((product) => {
                    const imageSrc = getProductImageSrc(product);

                    return (
                      <div key={product.id} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
                        <div className="w-11 h-11 rounded-xl bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
                          {imageSrc ? (
                            <ImageWithFallback src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">{product.emoji || "P"}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-gray-900 truncate"
                            style={{ fontSize: 13, fontWeight: 700 }}
                          >
                            {product.name}
                          </p>
                          {product.brand ? (
                            <p className="text-gray-500 truncate" style={{ fontSize: 12 }}>
                              {product.brand}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            setFavoritePendingId(product.id);
                            try {
                              await onToggleFavorite(product);
                            } finally {
                              setFavoritePendingId(null);
                            }
                          }}
                          className="w-8 h-8 rounded-xl bg-white flex items-center justify-center disabled:opacity-60"
                          disabled={favoritePendingId === product.id}
                          title="Remover dos favoritos"
                          aria-label="Remover dos favoritos"
                        >
                          {favoritePendingId === product.id ? (
                            <Loader className="w-4 h-4 text-amber-500 animate-spin" />
                          ) : (
                            <Star className="w-4 h-4 text-amber-500" fill="#F59E0B" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
