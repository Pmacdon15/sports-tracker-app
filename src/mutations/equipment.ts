"use client";

import { useMutation } from "@tanstack/react-query";
import { addEquipmentAction, deleteEquipmentAction, retireEquipmentAction } from "@/actions/equipment";

export function useAddEquipmentMutation() {
  return useMutation({
    mutationFn: async ({
      type,
      unit_number,
    }: {
      type: string;
      unit_number: string;
    }) => {
      const res = await addEquipmentAction(type, unit_number);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {},
  });
}

export function useDeleteEquipmentMutation() {
  return useMutation({
    mutationFn: async (unit_number: string) => {
      const res = await deleteEquipmentAction(unit_number);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {},
  });
}

export function useRetireEquipmentMutation() {
  return useMutation({
    mutationFn: async (unit_number: string) => {
      const res = await retireEquipmentAction(unit_number);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {},
  });
}
