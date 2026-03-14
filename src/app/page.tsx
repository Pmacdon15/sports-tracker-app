import { Show } from "@clerk/nextjs";
import { Activity, ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Hero Section */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight mb-6">
        Manage Your <span className="text-primary">Equipment</span>
        <br /> With Confidence
      </h1>

      <p className="max-w-[600px] text-lg text-muted-foreground mb-10">
        A premium, lightning-fast tracking solution for sports gear, rentals,
        and inventory. Never lose track of a raft or bike again.
      </p>

      {/* Call to Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Suspense>
          <Show when="signed-out">
            <Button size="lg" className="w-full sm:w-auto font-semibold gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Show>
        </Suspense>
        <Suspense>
          <Show when="signed-in">
            <Button
              size="lg"
              render={<Link href="/tracker" />}
              nativeButton={false}
              className="w-full sm:w-auto font-semibold gap-2 shadow-lg shadow-primary/25"
            >
              Go to Tracker
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/inventory" />}
              nativeButton={false}
              className="w-full sm:w-auto font-semibold"
            >
              View Inventory
            </Button>
          </Show>
        </Suspense>
      </div>

      {/* Features Outline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mt-8">
        <div className="flex flex-col items-center p-6 bg-card rounded-xl border shadow-sm">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">Live Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Monitor what's out, what's returning, and color-coded alert zones
            when time is running out.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-card rounded-xl border shadow-sm">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">Secure Base</h3>
          <p className="text-sm text-muted-foreground">
            Standard SQL and robust authentication to keep your guest logs
            strictly confidential.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-card rounded-xl border shadow-sm">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">Inventory Sync</h3>
          <p className="text-sm text-muted-foreground">
            No phantom rentals. You can only check out exactly what is verified
            in the system warehouse.
          </p>
        </div>
      </div>
    </div>
  );
}
