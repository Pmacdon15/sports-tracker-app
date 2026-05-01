import { Dumbbell } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-card/50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <p className="text-sm font-semibold tracking-tight">Sports Tracker</p>
        </div>

        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; 2026 Sports Tracker. All rights reserved.
        </p>

        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <Link
            href="/privacy"
            className="transition-colors hover:text-primary"
          >
            Privacy Policy
          </Link>
          <Link href="/tos" className="transition-colors hover:text-primary">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
