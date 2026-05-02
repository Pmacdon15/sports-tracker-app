import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="w-full py-32 px-6 flex flex-col items-center text-center bg-muted/10 border-t border-border">
      <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
        Ready to get organized?
      </h2>
      <p className="text-xl text-muted-foreground font-light mb-10 max-w-2xl tracking-tight">
        Join the outfitters who trust us to track their gear and streamline
        their daily workflow.
      </p>
      <Link href="/inventory">
        <Button
          size="lg"
          variant="outline"
          className="h-14 px-8 rounded-none border-border font-medium text-lg hover:bg-foreground hover:text-background transition-colors"
        >
          Start Managing Gear
        </Button>
      </Link>
    </section>
  );
}
