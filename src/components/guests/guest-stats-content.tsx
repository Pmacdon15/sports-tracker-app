"use client";

import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { CardContent } from "@/components/ui/card";
import { useInfiniteGuestStats } from "@/hooks/use-guests";

export default function GuestStatsContent() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteGuestStats();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <CardContent className="py-12 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </CardContent>
    );
  }

  if (status === "error") {
    return (
      <CardContent className="py-12 text-center text-destructive">
        Error: {error instanceof Error ? error.message : "Failed to load stats"}
      </CardContent>
    );
  }

  const allGuests = data.pages.flat();

  if (allGuests.length === 0) {
    return (
      <CardContent className="py-12 text-center text-muted-foreground">
        No guest data available yet.
      </CardContent>
    );
  }

  return (
    <CardContent className="p-0">
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-background z-10 border-b">
            <tr className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
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
          <tbody className="[&_tr:last-child]:border-0 font-medium">
            {allGuests.map((guest, idx) => (
              <tr
                key={`${guest.id}-${idx}`}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="p-4 align-middle">{guest.name}</td>
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
          className="h-20 flex items-center justify-center p-4"
        >
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : hasNextPage ? (
            <span className="text-xs text-muted-foreground animate-pulse">
              Load more...
            </span>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              End of list - {allGuests.length} guests
            </span>
          )}
        </div>
      </div>
    </CardContent>
  );
}
