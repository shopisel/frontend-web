import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, ChevronRight, Search, RefreshCw } from "lucide-react";
import { AddProductModal, type AddItemPayload } from "../../modals/AddProductModal/index";
import { useParams, useNavigate } from "react-router-dom";
import { useLists, ListResponse, ListItemRequest } from "../../../../api/useLists";
import { ApiError } from "../../../../api/useApi";
import { useProducts, Product } from "../../../../api/useProducts";
import { useStores, StoreResponse } from "../../../../api/useStores";
import { usePrices, calculateDiscountPercentage } from "../../../../api/usePrices";
import { getProductImageSrc } from "../../../../lib/imageUtils";
import { getBestPrice } from "../../../../lib/priceUtils";
import { ListItemRow, type EnrichedItem } from "./ListItemRow";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export function ListScreen({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();

  const { getList, updateList, removeList } = useLists();
  const { getProductsByIds } = useProducts();
  const { getStores } = useStores();
  const { getPrices } = usePrices();

  const [listDetails, setListDetails] = useState<ListResponse | null>(null);
  const [items, setItems] = useState<EnrichedItem[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const loadItems = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const listData = await getList(id);
      setListDetails(listData);
      const rawItems = listData.items || [];
      const productIds = Array.from(new Set(rawItems.map(i => i.productId)));
      const storeIds = Array.from(new Set(rawItems.map(i => i.storeId)));
      const productsMap: Record<string, Product> = {};
      const storesMap: Record<string, StoreResponse> = {};

      await Promise.allSettled([
        getProductsByIds(productIds).then(prods => prods.forEach(p => { productsMap[p.id] = p; })),
        getStores({ ids: storeIds.join(",") }).then(stores => stores.forEach(s => { storesMap[s.id] = s; })),
      ]);

      const priceByKey = new Map<string, ReturnType<typeof getBestPrice>>();
      await Promise.all(
        Array.from(new Set(rawItems.map(i => `${i.productId}::${i.storeId}`))).map(async key => {
          const [productId, storeId] = key.split("::");
          try { priceByKey.set(key, getBestPrice(await getPrices(productId, storeId))); }
          catch { priceByKey.set(key, { unitPrice: 0 }); }
        })
      );

      setItems(rawItems.map(item => {
        const product = productsMap[item.productId];
        const pricing = priceByKey.get(`${item.productId}::${item.storeId}`);
        return {
          ...item,
          name: product?.name || "Produto desconhecido",
          brand: product?.brand ?? null,
          emoji: product?.emoji || "📦",
          imageSrc: product ? getProductImageSrc(product) : undefined,
          storeName: storesMap[item.storeId]?.name || "Loja desconhecida",
          unitPrice: pricing?.unitPrice ?? 0,
          originalUnitPrice: pricing?.originalUnitPrice,
          discountPercent: pricing?.discountPercent,
        };
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [getList, getPrices, getProductsByIds, getStores]);

  useEffect(() => { if (listId) loadItems(listId); }, [listId, loadItems]);

  const commitUpdates = useCallback(async (id: string, version: string, updated: EnrichedItem[]) => {
    const payload: ListItemRequest[] = updated.map(i => ({ productId: i.productId, storeId: i.storeId, quantity: i.quantity, checked: i.checked }));
    try {
      const updatedList = await updateList(id, version, undefined, payload);
      setListDetails(updatedList);
    } catch (e) {
      console.error(e);
      window.alert(getListActionErrorMessage(e));
      if (listId) {
        await loadItems(listId);
      }
    }
  }, [getListActionErrorMessage, loadItems, listId, updateList]);

  const handleEditName = async () => {
    if (!listId || !newName.trim()) return;
    setIsLoading(true);
    try {
      const currentItems = listDetails?.items ?? [];
      const updatedList = await updateList(listId, listDetails?.version ?? "", newName.trim(), currentItems.map((item) => ({
        productId: item.productId,
        storeId: item.storeId,
        quantity: item.quantity,
        checked: item.checked,
      })));
      setListDetails(updatedList);
      setEditingName(false); setNewName("");
    } catch (e) {
      console.error(e);
      window.alert(getListActionErrorMessage(e));
      await loadItems(listId);
    }
    finally { setIsLoading(false); }
  };

  const handleDeleteList = async () => {
    if (!listId) return;
    setIsLoading(true);
    try { await removeList(listId, listDetails?.version ?? ""); navigate("/lists"); }
    catch (e) {
      console.error(e);
      window.alert(getListActionErrorMessage(e));
      await loadItems(listId);
    }
    finally { setIsLoading(false); }
  };

  const handleToggleItem = (id: number) => {
    if (!listId) return;
    const next = items.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
    setItems(next); void commitUpdates(listId, listDetails?.version ?? "", next);
  };

  const handleDeleteItem = (id: number) => {
    if (!listId) return;
    const next = items.filter(i => i.id !== id);
    setItems(next); void commitUpdates(listId, listDetails?.version ?? "", next);
  };

  const handleChangeQuantity = (id: number, delta: number) => {
    if (!listId) return;
    const next = items.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
    setItems(next); void commitUpdates(listId, listDetails?.version ?? "", next);
  };

  const handleAddItem = async (addedItem: AddItemPayload) => {
    if (!listId) return;
    let { name, emoji, storeName } = addedItem;
    let brand: string | null = addedItem.brand ?? null;
    let imageSrc: string | undefined;

    try {
      const prods = await getProductsByIds([addedItem.productId]);
      const product = prods?.[0];
      if (product) { name = product.name || name; brand = product.brand ?? brand; emoji = product.emoji || emoji; imageSrc = getProductImageSrc(product); }
    } catch (e) { console.error(e); }

    const newItem: EnrichedItem = {
      id: Date.now(), productId: addedItem.productId, storeId: addedItem.storeId,
      quantity: addedItem.quantity, checked: addedItem.checked,
      name, brand, emoji, imageSrc, storeName,
      unitPrice: addedItem.price, originalUnitPrice: addedItem.originalPrice,
      discountPercent: addedItem.originalPrice && addedItem.originalPrice > addedItem.price
        ? calculateDiscountPercentage(addedItem.originalPrice, addedItem.price) : undefined,
    };

    setItems(prev => {
      const idx = prev.findIndex(i => i.productId === newItem.productId && i.storeId === newItem.storeId);
      const next = idx >= 0
        ? prev.map((i, j) => j === idx ? { ...i, ...newItem, quantity: i.quantity + Math.max(1, newItem.quantity), checked: false } : i)
        : [...prev, newItem];
      void commitUpdates(listId, listDetails?.version ?? "", next);
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    if (!searchInput.trim()) return items;
    const needle = searchInput.toLowerCase();
    return items.filter(i => i.name.toLowerCase().includes(needle) || Boolean(i.brand?.toLowerCase().includes(needle)));
  }, [items, searchInput]);

  const shouldAnimateRows = filteredItems.length <= 24;
  const total = items.filter(i => !i.checked).reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="flex min-h-full flex-col bg-page overflow-x-hidden">
      <div className="bg-white shadow-sm z-10 relative">
        <div className="max-w-5xl mx-auto w-full px-5 lg:px-8 pt-5 sm:pt-6 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => onNavigate ? onNavigate("lists") : navigate("/lists")} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-gray-500 rotate-180" />
              </button>
              <div className="flex-1 min-w-0">
                {editingName ? (
                  <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} onBlur={() => void handleEditName()} onKeyPress={e => e.key === "Enter" && void handleEditName()} className="w-full bg-transparent outline-none text-gray-900 border-b-2 border-indigo-600 text-xl font-bold" />
                ) : (
                  <button onClick={() => { setEditingName(true); setNewName(listDetails?.name || ""); }} className="text-gray-900 truncate hover:text-indigo-600 transition-colors text-left text-xl font-bold">
                    {listDetails?.name || "Lista"}
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button onClick={() => setDeleteConfirm(true)} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
              <button onClick={() => listId && loadItems(listId)} className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                <RefreshCw className={`w-4 h-4 text-indigo-600 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full bg-indigo-500 rounded-full" animate={{ width: items.length ? `${(checkedCount / items.length) * 100}%` : "0%" }} transition={{ duration: 0.5, ease: "easeOut" }} />
            </div>
            <span className="text-gray-500 text-xs font-semibold">{checkedCount}/{items.length}</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <Search className="w-4 h-4 text-gray-400" />
              <input placeholder="Pesquisar artigos..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="flex-1 bg-transparent outline-none text-gray-700 text-sm" />
            </div>
            <div className="bg-indigo-50 rounded-xl px-3 py-2.5 self-start sm:self-auto">
              <span className="text-indigo-600 text-sm font-bold">€{total.toFixed(2)}</span>
            </div>
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => setShowAddModal(true)} className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white shadow-sm text-sm font-bold" type="button">
              <Plus className="w-4 h-4" /> Adicionar artigo
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full px-5 lg:px-8 py-4 pb-28 md:pb-4">
          {isLoading && items.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 shadow-card"><p className="text-gray-500 text-center text-sm">A carregar itens...</p></div>
          ) : (
            <AnimatePresence>
              {filteredItems.map(item => (
                <motion.div key={item.id} layout={shouldAnimateRows} initial={shouldAnimateRows ? { opacity: 0, x: -20 } : false} animate={shouldAnimateRows ? { opacity: 1, x: 0 } : undefined} exit={shouldAnimateRows ? { opacity: 0, height: 0, marginBottom: 0 } : undefined} className="bg-white rounded-2xl mb-2.5 overflow-hidden" style={{ boxShadow: shouldAnimateRows ? "var(--shadow-card)" : "var(--shadow-card-sm)", contentVisibility: "auto", containIntrinsicSize: "84px" }}>
                  <ListItemRow item={item} animated={shouldAnimateRows} onToggle={handleToggleItem} onDelete={handleDeleteItem} onChangeQuantity={handleChangeQuantity} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {!isLoading && filteredItems.length === 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-card"><p className="text-gray-500 text-center text-sm">Nenhum item adicionado.</p></div>
          )}
        </div>
      </div>

      <div className="fixed bottom-24 right-6 md:hidden">
        <motion.button whileTap={{ scale: 0.92 }} onClick={() => setShowAddModal(true)} className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center shadow-xl">
          <Plus className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {deleteConfirm && <DeleteConfirmDialog onConfirm={() => void handleDeleteList()} onCancel={() => setDeleteConfirm(false)} />}
      <AddProductModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAddItem={item => void handleAddItem(item)} />
    </div>
  );
}
