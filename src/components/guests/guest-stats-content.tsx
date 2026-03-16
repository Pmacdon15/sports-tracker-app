"use client";

import { format } from "date-fns";
import { ExternalLink, Loader2, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useInfiniteGuestStats } from "@/hooks/use-guests";

export default function GuestStatsContent() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteGuestStats(20, debouncedSearch);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allGuests = data?.pages.flat() || [];

  return (
    <CardContent className="p-0 flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b bg-muted/20 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guests by name..."
            className="pl-9 pr-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 w-10 hover:bg-transparent text-muted-foreground hover:text-foreground"
              onClick={() => setSearch("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {status === "pending" && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Table Container */}
      <div className="flex-1 min-h-[400px] max-h-[600px] overflow-y-auto custom-scrollbar relative">
        {status === "error" ? (
          <div className="py-12 text-center text-destructive">
            Error:{" "}
            {error instanceof Error ? error.message : "Failed to load stats"}
          </div>
        ) : status === "pending" && allGuests.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2 justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Searching guests...</p>
          </div>
        ) : allGuests.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Search className="h-10 w-10 opacity-20" />
            <p className="font-medium text-lg">No guests found</p>
            <p className="text-sm opacity-70">Try adjusting your search.</p>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background z-10 border-b">
                <tr className="transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Guest Name
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                    Trips Taken
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody className="font-medium border-b">
                {allGuests.map((guest, idx) => (
                  <tr
                    key={`${guest.id}-${idx}`}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle">
                      <Link
                        href={`/guest-trips/${guest.id}`}
                        className="font-bold text-primary hover:underline flex items-center gap-2 group/link"
                      >
                        {guest.name}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="p-4 align-middle text-center">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-bold">
                        {guest.trip_count}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right text-muted-foreground font-normal">
                      {guest.last_trip_at
                        ? format(new Date(guest.last_trip_at), "MMM d, yyyy")
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Sentinel for auto-loading */}
            <div
              ref={sentinelRef}
              className="h-24 flex items-center justify-center p-4 border-t bg-muted/5"
            >
              {isFetchingNextPage ? (
                <div className="flex flex-col items-center gap-2 text-primary font-medium">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-[10px] animate-pulse uppercase tracking-wider">
                    Loading More
                  </span>
                </div>
              ) : hasNextPage ? (
                <span className="text-xs text-muted-foreground animate-pulse">
                  Scroll for more results
                </span>
              ) : (
                <div className="flex flex-col items-center gap-1 opacity-60">
                  <div className="h-px w-24 bg-muted-foreground/30 mb-2" />
                  <span className="text-[10px] text-muted-foreground italic font-medium uppercase tracking-widest">
                    End of Results ({allGuests.length})
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </CardContent>
  );
}
