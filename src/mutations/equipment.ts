"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addEquipmentAction,
  deleteEquipmentAction,
  retireEquipmentAction,
} from "@/actions/equipment";

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
      if (res && "message" in res) {
        throw new Error(res.message);
      }

      return res;
    },
    onSuccess: () => {},
  });
}

export function useDeleteEquipmentMutation() {
  return useMutation({
    mutationFn: async (unit_number: string) => {
      const res = await deleteEquipmentAction(unit_number);
      if (res && "message" in res) {
        throw new Error(res.message);
      }

      if (res && "value" in res) {
        return res.value;
      }
      return res;
    },
    onSuccess: (data) => toast.success(`Deleted equipment ${data.unit_number}`),
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useRetireEquipmentMutation() {
  return useMutation({
    mutationFn: async (unit_number: string) => {
      const res = await retireEquipmentAction(unit_number);
      if (res && "message" in res) {
        throw new Error(res.message);
      }

      if (res && "value" in res) {
        return res.value;
      }
      return res;
    },
    onSuccess: (data) => toast.success(`Retired equipment ${data.unit_number}`),
    onError: (error: Error) => toast.error(error.message),
  });
}
