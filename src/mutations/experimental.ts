"use client";

import { useMutation } from "@tanstack/react-query";
import { updateExperimentalFeatureAction } from "@/actions/experimental";

export function useUpdateExperimentalFeatureMutation() {
  return useMutation({
    mutationFn: async ({
      featureName,
      isEnabled,
      apiKey,
    }: {
      featureName: string;
      isEnabled: boolean;
      apiKey: string | null;
    }) => {
      const res = await updateExperimentalFeatureAction(
        featureName,
        isEnabled,
        apiKey,
      );
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {},
  });
}
