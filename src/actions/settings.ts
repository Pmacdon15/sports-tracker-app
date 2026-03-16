"use server";

import { updateTag } from "next/cache";
import { updateSetting } from "@/dal/settings";
import type { DbResult, Setting } from "@/db/types";

export async function updateSettingAction(
  key: string,
  value: string,
): Promise<DbResult<Setting>> {
  const res = await updateSetting(key, value);
  if (!res.error) {
    updateTag(`settings-${res.data?.org_id}`);
  }
  return res;
}
