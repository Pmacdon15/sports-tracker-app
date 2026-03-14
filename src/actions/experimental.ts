"use server";

import { auth } from "@clerk/nextjs/server";
import { updateTag } from "next/cache";
import { updateExperimentalFeature } from "@/dal/experimental";
import type { DbResult, ExperimentalFeature } from "@/db/types";

export async function updateExperimentalFeatureAction(
  featureName: string,
  isEnabled: boolean,
  apiKey: string | null,
): Promise<DbResult<ExperimentalFeature>> {
  const result = await updateExperimentalFeature(
    featureName,
    isEnabled,
    apiKey,
  );

  if (!result.error) {
    const { orgId } = await auth();
    if (orgId) {
      updateTag(`experimental-features-${orgId}`);
    }
  }

  return result;
}
