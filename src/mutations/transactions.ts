"use client";

import { useMutation } from "@tanstack/react-query";
import {
  checkoutEquipmentAction,
  returnEquipmentAction,
} from "@/actions/transactions";

export function useCheckoutMutation() {
  return useMutation({
    mutationFn: async ({
      unit_number,
      guest_name,
    }: {
      unit_number: string;
      guest_name: string;
    }) => {
      const res = await checkoutEquipmentAction(unit_number, guest_name);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {},
  });
}

export function useReturnMutation() {
  return useMutation({
    mutationFn: async (unit_number: string) => {
      const res = await returnEquipmentAction(unit_number);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {},
  });
}
