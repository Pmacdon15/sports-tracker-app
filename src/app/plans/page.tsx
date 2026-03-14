import { PricingTable } from "@clerk/nextjs";

export default function PlansPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-6xl">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl">
          Select the perfect plan for your sports tracking needs. From basic
          usage to professional sports management.
        </p>
      </div>
      <div className="w-full flex justify-center">
        <PricingTable for="organization" />
      </div>
    </div>
  );
}
