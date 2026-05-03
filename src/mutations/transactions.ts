"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
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

      if (res && "message" in res) {
        throw new Error(res.message);
      }

      if (res && "value" in res) {
        return res.value;
      }

      return res;
    },
    onSuccess: (data) => {
      const unit = data.equipment_unit || (data as any).unit_number;
      toast.success(`Successfully checked out unit ${unit}`);
    },
    onError: (error) => {
      // error.message will be your custom reason (e.g., "Equipment is not available")
      console.error("Mutation failed:", error.message);
    },
  });
}

export function useReturnMutation() {
  return useMutation({
    mutationFn: async ({ unit_number, photo }: { unit_number: string; photo?: File | null }) => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formData = new FormData();
      formData.append("unit_number", unit_number);
      formData.append("timezone", timezone);
      if (photo) {
        formData.append("photo", photo);
      }
      const res = await returnEquipmentAction(formData);

      if (res && "message" in res) {
        throw new Error(res.message);
      }

      if (res && "value" in res) {
        return res.value;
      }

      return res;
    },
    onSuccess: (data) => {
      // Use equipment_unit if unit_number doesn't exist on Transaction
      const unit = data.equipment_unit || (data as any).unit_number;
      toast.success(`Successfully returned unit ${unit}`);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
