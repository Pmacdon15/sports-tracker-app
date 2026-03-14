"use client";

import { useMutation } from "@tanstack/react-query";
import { updateSettingAction } from "@/actions/settings";

export function useUpdateSettingMutation() {
  return useMutation({
    mutationFn: async (data: {
      yellow_trigger_hours?: string;
      red_trigger_hours?: string;
    }) => {
      const results = await Promise.all([
        data.yellow_trigger_hours
          ? updateSettingAction(
              "yellow_trigger_hours",
              data.yellow_trigger_hours,
            )
          : Promise.resolve({ error: null }),
        data.red_trigger_hours
          ? updateSettingAction("red_trigger_hours", data.red_trigger_hours)
          : Promise.resolve({ error: null }),
      ]);

      for (const res of results) {
        if (res.error) throw new Error(res.error);
      }
      return results;
    },
    onSuccess: () => {},
  });
}
