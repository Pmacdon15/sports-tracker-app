"use client";

import { useMutation } from "@tanstack/react-query";
import {
  checkoutEquipmentAction,
  returnEquipmentAction,
} from "@/actions/transactions";
import type { CheckoutInput } from "@/zod/schemas/transaction-schema";

export function useCheckoutMutation() {
  return useMutation({
    mutationFn: async ({
      unit_number,
      guest_name,
      type,
    }: CheckoutInput) => {
      const res = await checkoutEquipmentAction(unit_number, guest_name, type);

      if (res && "message" in res) {
        throw new Error(res.message);
      }

      return res;
    },
    onSuccess: (data) => {
      console.log("Success!", data);
    },
    onError: (error) => {
      console.error("Mutation failed:", error.message);
    },
  });
}

export function useReturnMutation() {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (unit_number: string) => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await returnEquipmentAction(unit_number, timezone);
      if (res && "message" in res) {
        throw new Error(res.message);
      }

      return res;
    },
    onSuccess: () => {      
    },
  });
}
