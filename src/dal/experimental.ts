import { auth } from "@clerk/nextjs/server";
import {
  getExperimentalFeaturesDb,
  upsertExperimentalFeatureDb,
} from "@/db/experimental";
import type { DbResult, ExperimentalFeature } from "@/db/types";

export async function getExperimentalFeatures(): Promise<
  DbResult<(ExperimentalFeature & { description: string | null })[]>
> {
  try {
    const { orgId, has } = await auth.protect();
    if (!has({ role: "org:admin" }) || has({ plan: "free" }) || !orgId) {
      throw new Error(
        "Only administrators can update experimental features and must be paid account.",
      );
    }
    const data = await getExperimentalFeaturesDb(orgId);
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error fetching experimental features:", e);
    return { data: null, error: "Failed to fetch experimental features" };
  }
}

export async function updateExperimentalFeature(
  featureName: string,
  isEnabled: boolean,
  apiKey: string | null,
): Promise<DbResult<ExperimentalFeature>> {
  try {
    const { orgId, has } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    if (!has({ role: "org:admin" }) || has({ plan: "free" })) {
      throw new Error(
        "Only administrators can update experimental features and must be paid account.",
      );
    }

    const data = await upsertExperimentalFeatureDb(
      orgId,
      featureName,
      isEnabled,
      apiKey,
    );
    return { data, error: null };
  } catch (e: unknown) {
    console.error(`Error updating experimental feature ${featureName}:`, e);
    return { data: null, error: "Failed to update experimental feature" };
  }
}
