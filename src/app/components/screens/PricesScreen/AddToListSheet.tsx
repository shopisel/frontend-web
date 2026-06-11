import { useState, useEffect } from "react";
import { Plus, Loader2, Check, ListPlus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../ui/sheet";
import { useLists, type ListResponse } from "../../../../api/useLists";
import { ApiError } from "../../../../api/useApi";
import type { Product } from "../../../../api/useProducts";
import type { StoreRow } from "./types";

interface AddToListSheetProps {
  product: Product | null;
  bestStore: StoreRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToListSheet({ product, bestStore, isOpen, onClose }: AddToListSheetProps) {
  const { getLists, getList, createList, updateList } = useLists();

  const [lists, setLists] = useState<ListResponse[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [addingToListId, setAddingToListId] = useState<string | null>(null);
  const [successListId, setSuccessListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const [showNewListInput, setShowNewListInput] = useState(false);

  const getListActionErrorMessage = (error: unknown) => {
    if (error instanceof ApiError) {
      if (error.status === 428) return "Falta a versao da lista. Recarrega e tenta novamente.";
      if (error.status === 409) return "A lista foi alterada por outro utilizador. Recarrega e refaz o merge.";
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "Nao foi possivel atualizar a lista.";
  };

  useEffect(() => {
    if (!isOpen) {
      setSuccessListId(null);
      setShowNewListInput(false);
      setNewListName("");
      return;
    }
    setLoadingLists(true);
    getLists()
      .then(setLists)
      .catch(() => setLists([]))
      .finally(() => setLoadingLists(false));
  }, [isOpen, getLists]);

  const handleAddToList = async (list: ListResponse) => {
    if (!product || !bestStore) return;
    setAddingToListId(list.id);
    try {
      const fullList = await getList(list.id);
      const existingItem = fullList.items.find(
        (item) => item.productId === product.id && item.storeId === bestStore.id
      );
      const updatedItems = existingItem
        ? fullList.items.map((item) =>
            item.productId === product.id && item.storeId === bestStore.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...fullList.items,
            { productId: product.id, storeId: bestStore.id, quantity: 1, checked: false },
          ];

      await updateList(
        list.id,
        fullList.version,
        undefined,
        updatedItems.map((item) => ({
          productId: item.productId,
          storeId: item.storeId,
          quantity: item.quantity,
          checked: item.checked,
        }))
      );
      setSuccessListId(list.id);
      setTimeout(onClose, 1200);
    } catch (error) {
      console.error(error);
      window.alert(getListActionErrorMessage(error));
    } finally {
      setAddingToListId(null);
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newListName.trim() || !product || !bestStore) return;
    setCreatingNew(true);
    try {
      const newList = await createList(newListName.trim());
      await updateList(newList.id, newList.version, undefined, [
        { productId: product.id, storeId: bestStore.id, quantity: 1, checked: false },
      ]);
      setSuccessListId(newList.id);
      setTimeout(onClose, 1200);
    } catch (error) {
      console.error(error);
      window.alert(getListActionErrorMessage(error));
    } finally {
      setCreatingNew(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl pb-10 max-h-[80vh] overflow-y-auto"
      >
        <SheetHeader className="px-5 pt-2 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <ListPlus className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-gray-900 text-left" style={{ fontSize: 16 }}>
                Adicionar à lista
              </SheetTitle>
              {product && (
                <p className="text-gray-400 truncate mt-0.5" style={{ fontSize: 13 }}>
                  {product.name}
                </p>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="px-5 flex flex-col gap-3">
          {loadingLists ? (
            <div className="flex items-center justify-center gap-2 py-8">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              <span className="text-gray-400" style={{ fontSize: 14 }}>A carregar listas...</span>
            </div>
          ) : lists.length === 0 && !showNewListInput ? (
            <p className="text-center text-gray-400 py-6" style={{ fontSize: 14 }}>
              Ainda não tens nenhuma lista.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {lists.map((list) => (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => void handleAddToList(list)}
                  disabled={!!addingToListId || !!successListId}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors disabled:opacity-60 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span style={{ fontSize: 18 }}>📋</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-800 truncate" style={{ fontSize: 14, fontWeight: 600 }}>
                        {list.name}
                      </p>
                      <p className="text-gray-400" style={{ fontSize: 12 }}>
                        {list.items.length} artigo{list.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    {successListId === list.id ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : addingToListId === list.id ? (
                      <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {showNewListInput ? (
            <div className="flex gap-2 mt-1">
              <input
                autoFocus
                type="text"
                placeholder="Nome da nova lista..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleCreateAndAdd();
                  if (e.key === "Escape") setShowNewListInput(false);
                }}
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-indigo-400 text-gray-800"
                style={{ fontSize: 14 }}
              />
              <button
                type="button"
                onClick={() => void handleCreateAndAdd()}
                disabled={!newListName.trim() || creatingNew}
                className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-semibold disabled:opacity-50 flex items-center justify-center"
                style={{ fontSize: 14, minWidth: 68 }}
              >
                {creatingNew ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewListInput(true)}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-gray-400 hover:text-indigo-600"
            >
              <Plus className="w-4 h-4" />
              <span style={{ fontSize: 14, fontWeight: 500 }}>Nova lista</span>
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
