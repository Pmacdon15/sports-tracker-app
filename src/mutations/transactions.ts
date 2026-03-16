"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  checkoutEquipmentAction,
  returnEquipmentAction,
} from "@/actions/transactions";

export function useCheckoutMutation() {
  return useMutation({
    mutationFn: async ({
      unit_number,
      guest_name,
      type,
    }: {
      unit_number: string;
      guest_name: string;
      type?: string;
    }) => {
      const res = await checkoutEquipmentAction(unit_number, guest_name, type);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {},
  });
}

export function useReturnMutation() {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (unit_number: string) => {
      const res = await returnEquipmentAction(unit_number);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["guest-stats-infinite", search],
      // });
    },
  });
}
