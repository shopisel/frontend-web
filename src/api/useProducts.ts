import { useApi } from "./useApi";
import { useCallback } from "react";

export interface Category {
  id: string;
  name: string;
  image?: string;
  emoji?: string;
}

export interface Product {
  id: string;
  name: string;
  brand?: string | null;
  barcode: string;
  categoryId: string;
  image?: string;
  emoji?: string;
}

export function useProducts() {
  const { get } = useApi();

  const searchProducts = useCallback(async (query: string, limit?: number, skip?: number): Promise<Product[]> => {
    const params = new URLSearchParams();
    params.set("name", query);
    if (typeof limit === "number") params.set("limit", String(limit));
    if (typeof skip === "number") params.set("skip", String(skip));
    return await get(`/products?${params.toString()}`);
  }, [get]);

  const getMainCategories = useCallback(async (): Promise<Category[]> => {
    return await get("/categories/main");
  }, [get]);

  const getSubCategories = useCallback(async (categoryId: string): Promise<Category[]> => {
    return await get(`/categories/${categoryId}/subcategories`);
  }, [get]);

  const getProductsByCategory = useCallback(async (categoryId: string, limit?: number, skip?: number): Promise<Product[]> => {
    const params = new URLSearchParams();
    params.set("categoryId", categoryId);
    if (typeof limit === "number") params.set("limit", String(limit));
    if (typeof skip === "number") params.set("skip", String(skip));
    return await get(`/products?${params.toString()}`);
  }, [get]);

  const getProductsByIds = useCallback(async (ids: string[]): Promise<Product[]> => {
    if (!ids.length) return [];
    return await get(`/products?ids=${encodeURIComponent(ids.join(","))}`);
  }, [get]);

  const getRelatedProductsByFavoriteIds = useCallback(
    async (favoriteIds: string[], limit?: number, maxDistance?: number): Promise<Product[]> => {
      if (!favoriteIds.length) return [];

      const params = new URLSearchParams();
      params.set("favoriteIds", favoriteIds.join(","));
      if (typeof limit === "number") params.set("limit", String(limit));
      if (typeof maxDistance === "number") params.set("maxDistance", String(maxDistance));

      return await get(`/products/related?${params.toString()}`);
    },
    [get]
  );

  return {
    searchProducts,
    getMainCategories,
    getSubCategories,
    getProductsByCategory,
    getProductsByIds,
    getRelatedProductsByFavoriteIds,
  };
}
