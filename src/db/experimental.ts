import { cacheTag } from "next/cache";
import { getSql } from "./db";
import type { ExperimentalFeature } from "./types";

export async function getExperimentalFeaturesDb(
  orgId: string,
): Promise<(ExperimentalFeature & { description: string | null })[]> {
  "use cache";
  cacheTag(`experimental-features-${orgId}`);

  const sql = getSql();
  const res = await sql`
    SELECT 
      sf.name as feature_name, 
      sf.description, 
      COALESCE(ef.is_enabled, FALSE) as is_enabled, 
      ef.api_key, 
      COALESCE(ef.org_id, ${orgId}) as org_id,
      ef.updated_at
    FROM system_features sf
    LEFT JOIN experimental_features ef ON sf.name = ef.feature_name AND ef.org_id = ${orgId}
    ORDER BY sf.name ASC
  `;
  return res as unknown as (ExperimentalFeature & {
    description: string | null;
  })[];
}

export async function upsertExperimentalFeatureDb(
  orgId: string,
  featureName: string,
  isEnabled: boolean,
  apiKey: string | null,
): Promise<ExperimentalFeature> {
  const sql = getSql();
  const res = await sql`
    INSERT INTO experimental_features (org_id, feature_name, is_enabled, api_key)
    VALUES (${orgId}, ${featureName}, ${isEnabled}, ${apiKey})
    ON CONFLICT (org_id, feature_name)
    DO UPDATE SET 
      is_enabled = EXCLUDED.is_enabled,
      api_key = EXCLUDED.api_key,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  return res[0] as unknown as ExperimentalFeature;
}
