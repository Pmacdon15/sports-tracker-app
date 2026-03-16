import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import GuestTripsHeader from "@/components/guests/guest-trips-header";
import GuestTripsList from "@/components/guests/guest-trips-list";
import { Button } from "@/components/ui/button";
import { getGuestById } from "@/dal/guests";
import { getGuestTransactions } from "@/dal/transactions";

export default function GuestTripsPage(
  props: PageProps<"/guest-trips/[guestId]">,
) {
  const guestPromise = props.params.then((p) => getGuestById(p.guestId));
  const tripsPromise = props.params.then((p) =>
    getGuestTransactions(p.guestId),
  );

  return (
    <div className="container mx-auto py-8 px-4 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"          
          className="mb-4 hover:bg-primary/5 hover:text-primary transition-all"
        >
          <Link href="/guests" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Analytics
          </Link>
        </Button>

        <Suspense
          fallback={
            <div className="flex items-center gap-4 animate-pulse">
              <div className="h-16 w-16 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-8 w-64 bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
            </div>
          }
        >
          <GuestTripsHeader guestPromise={guestPromise} />
        </Suspense>
      </div>

      <div className="mt-12 space-y-6">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-muted/5 rounded-2xl border border-dashed border-muted">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary/40" />
              <p className="text-sm font-medium animate-pulse">
                Fetching trip history...
              </p>
            </div>
          }
        >
          <GuestTripsList tripsPromise={tripsPromise} />
        </Suspense>
      </div>
    </div>
  );
}
