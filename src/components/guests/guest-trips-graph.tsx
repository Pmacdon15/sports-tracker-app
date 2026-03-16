import { use } from "react";
import { CardContent } from "@/components/ui/card";
import type { DbResult, GuestStats } from "@/db/types";

export default function GuestTripsGraph({
  statsPromise,
}: {
  statsPromise: Promise<DbResult<GuestStats[]>>;
}) {
  const { data: stats, error } = use(statsPromise);

  if (error || !stats || stats.length === 0) {
    return (
      <CardContent className="py-12 text-center text-muted-foreground">
        {error ? "Error loading graph" : "No data for distribution graph"}
      </CardContent>
    );
  }

  const maxTrips = Math.max(...stats.map((s) => s.trip_count));

  return (
    <CardContent className="pt-4">
      <div className="space-y-4">
        {stats.slice(0, 8).map((guest) => (
          <div key={guest.id} className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="truncate max-w-[150px]">{guest.name}</span>
              <span>{guest.trip_count} trips</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${(guest.trip_count / maxTrips) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {stats.length > 8 && (
          <p className="text-[10px] text-center text-muted-foreground italic pt-2">
            Showing top 8 active guests
          </p>
        )}
      </div>
    </CardContent>
  );
}
