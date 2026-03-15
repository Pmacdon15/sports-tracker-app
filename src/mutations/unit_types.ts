"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { addUnitTypeAction, getUnitTypesAction } from "@/actions/unit_types";

export function useUnitTypesQuery() {
  return useQuery({
    queryKey: ["unit-types"],
    queryFn: async () => {
      const res = await getUnitTypesAction();
      if (res.error) throw new Error(res.error);
      return res.data;
    },
  });
}

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
