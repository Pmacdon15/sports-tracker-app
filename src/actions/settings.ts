"use server";

import { auth } from "@clerk/nextjs/server";
import { updateTag } from "next/cache";
import { updateSetting } from "@/dal/settings";
import type { DbResult } from "@/db/types";

export async function updateSettingAction(
  key: string,
  value: string,
): Promise<DbResult<void>> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Unauthorized");

  const res = await updateSetting(key, value);
  if (!res.error) {
    updateTag(`settings-${orgId}`);
  }
  return res;
}
