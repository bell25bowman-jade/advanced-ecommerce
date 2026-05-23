import { useQuery } from "@tanstack/react-query";
import { Product } from "../types/Products";
import { api } from "../client/Api";

export const useCategories = () =>
  useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<string[]>("/products/categories");
      return data;
    },
  });

export const useProducts = (category?: string) =>
  useQuery<Product[]>({
    queryKey: ["products", category || "all"],
    queryFn: async () => {
      const url = category ? `/products/category/${category}` : "/products";
      const { data } = await api.get<Product[]>(url);
      return data;
    },
  });
