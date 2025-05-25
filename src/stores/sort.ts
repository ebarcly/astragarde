import { atom } from "nanostores";

export type SortOption = 
  | "best_selling"
  | "featured"
  | "alpha_asc"
  | "alpha_desc"
  | "price_asc"
  | "price_desc"
  | "date_asc"
  | "date_desc";

export const sort = atom<SortOption>("best_selling");

// Helper function to get the sort query for Shopify
export function getSortQuery(sortOption: SortOption): { sortKey: string; reverse: boolean } {
  switch (sortOption) {
    case "best_selling":
      return { sortKey: "BEST_SELLING", reverse: false };
    case "featured":
      return { sortKey: "MANUAL", reverse: false };
    case "alpha_asc":
      return { sortKey: "TITLE", reverse: false };
    case "alpha_desc":
      return { sortKey: "TITLE", reverse: true };
    case "price_asc":
      return { sortKey: "PRICE", reverse: false };
    case "price_desc":
      return { sortKey: "PRICE", reverse: true };
    case "date_asc":
      return { sortKey: "CREATED_AT", reverse: false };
    case "date_desc":
      return { sortKey: "CREATED_AT", reverse: true };
    default:
      return { sortKey: "BEST_SELLING", reverse: false };
  }
} 