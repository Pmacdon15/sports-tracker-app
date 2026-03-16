import { Suspense } from "react";
import GuestStatsContent from "@/components/guests/guest-stats-content";
import GuestStatsHeader from "@/components/guests/guest-stats-header";
import GuestTripsGraph from "@/components/guests/guest-trips-graph";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getGlobalGuestStats, getGuestStats } from "@/dal/guests";

export default function GuestsPage() {
  const statsPromise = getGuestStats();
  const globalStatsPromise = getGlobalGuestStats();

  return (
    <div className="container mx-auto py-8 px-4 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Guest Analytics
        </h1>
        <p className="text-muted-foreground">
          Detailed insights into guest activity and rental patterns.
        </p>
      </div>

      <div className="grid gap-8">
        <Suspense
          fallback={
            <div className="h-32 bg-muted/20 animate-pulse rounded-xl" />
          }
        >
          <GuestStatsHeader globalStatsPromise={globalStatsPromise} />
        </Suspense>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Guest Engagement</CardTitle>
              </CardHeader>
              <Suspense
                fallback={
                  <div className="h-96 bg-muted/20 animate-pulse rounded-xl m-6" />
                }
              >
                <GuestStatsContent />
              </Suspense>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Trip Distribution</CardTitle>
              </CardHeader>
              <Suspense
                fallback={
                  <div className="h-96 bg-muted/20 animate-pulse rounded-xl m-6" />
                }
              >
                <GuestTripsGraph statsPromise={statsPromise} />
              </Suspense>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
