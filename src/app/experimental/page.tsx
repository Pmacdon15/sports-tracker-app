import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FeatureList } from "@/components/experimental/feature-list";
import { getExperimentalFeatures } from "@/dal/experimental";

export default async function ExperimentalPage() {
  const { has, orgId } = await auth();

  if (!orgId) {
    redirect("/");
  }

  // Check if plan is not free
  // Assuming 'org:premium' or similar is used for non-free accounts
  // The user mentioned using 'has' to see if subscription plan is not free
  const isNotFree =
    has({ permission: "org:subscription:manage" }) ||
    has({ role: "org:admin" });

  if (!isNotFree) {
    redirect("/");
  }

  const isAdmin = has({ role: "org:admin" });

  const result = await getExperimentalFeatures();

  if (result.error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Experimental Features</h1>
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {result.error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Experimental Features
        </h1>
        <p className="text-muted-foreground">
          Enable and configure experimental features for your organization. Some
          features may require an API key.
        </p>
      </div>

      <FeatureList initialFeatures={result.data || []} isAdmin={isAdmin} />
    </div>
  );
}
