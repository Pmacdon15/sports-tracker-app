"use client";

import { useMutation } from "@tanstack/react-query";
import { addUnitTypeAction } from "@/actions/unit_types";

export function useAddUnitTypeMutation() {
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await addUnitTypeAction(name);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {},
  });
}
