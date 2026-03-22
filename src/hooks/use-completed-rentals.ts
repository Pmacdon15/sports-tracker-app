import { useInfiniteQuery } from "@tanstack/react-query";
import type { Transaction } from "@/db/types";

export function useInfiniteCompletedRentals(date: string, limit = 20, search?: string) {
  return useInfiniteQuery({
    queryKey: ["completed-rentals-infinite", date, search],
    queryFn: async ({ pageParam = 1 }) => {
      const url = new URL("/api/transactions/completed", window.location.origin);
      url.searchParams.set("page", String(pageParam));
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("date", date);
      if (search) url.searchParams.set("query", search);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Failed to fetch completed rentals");
      }
      return response.json() as Promise<Transaction[]>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < limit ? undefined : allPages.length + 1;
    },
  });
}
