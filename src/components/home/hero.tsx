import { Show } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="px-6 py-32 md:py-48 max-w-7xl mx-auto w-full flex flex-col items-start border-b border-border">
      <h1 className="text-5xl md:text-[5.5rem] font-medium tracking-tighter mb-8 max-w-5xl leading-[1.05]">
        Equipment management, <br className="hidden md:block" />
        <span className="text-muted-foreground">simplified.</span>
      </h1>

      <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 font-light leading-relaxed tracking-tight">
        A clear, fast, and reliable platform to track your sports gear, manage
        guest checkouts, and maintain perfect inventory records.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Suspense>
          <Show when="signed-out">
            <Link href={"/inventory"}>
              <Button
                size="xl"
                className="w-full sm:w-auto font-medium px-10 h-14 text-base rounded-none bg-foreground text-background hover:bg-foreground/90 transition-colors group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Show>
        </Suspense>
        <Suspense>
          <Show when="signed-in">
            <Button
              size="xl"
              render={<Link href="/tracker" />}
              nativeButton={false}
              className="w-full sm:w-auto font-medium px-10 h-14 text-base rounded-none bg-foreground text-background hover:bg-foreground/90 transition-colors group"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Show>
        </Suspense>
      </div>
    </section>
  );
}
