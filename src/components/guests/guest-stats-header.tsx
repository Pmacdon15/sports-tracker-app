import { Ticket, TrendingUp, Users } from "lucide-react";
import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { DbResult, GlobalGuestStats } from "@/db/types";

export default function GuestStatsHeader({
  globalStatsPromise,
}: {
  globalStatsPromise: Promise<DbResult<GlobalGuestStats>>;
}) {
  const { data: stats, error } = use(globalStatsPromise);

  if (error || !stats) {
    return (
      <div className="p-4 text-destructive bg-destructive/10 rounded-lg">
        {error || "Failed to load global stats"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Guests
              </p>
              <p className="text-2xl font-bold">{stats.total_guests}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Ticket className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Trips
              </p>
              <p className="text-2xl font-bold">{stats.total_trips}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg Trips / Guest
              </p>
              <p className="text-2xl font-bold">
                {stats.avg_trips_per_guest.toFixed(1)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
