import { CallToAction } from "@/components/home/cta";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full bg-background selection:bg-primary selection:text-primary-foreground">
      <Hero />
      <Features />
      <CallToAction />
    </div>
  );
}
