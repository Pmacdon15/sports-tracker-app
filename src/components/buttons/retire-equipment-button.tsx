"use client";

import { useAuth } from "@clerk/nextjs";
import { startTransition } from "react";
import { useRetireEquipmentMutation } from "@/mutations/equipment";
import { Button } from "../ui/button";

export function InventoryRetireButton({
  unit_number,
  onRetire,
}: {
  unit_number: string;
  onRetire: () => void;
}) {
  const { has } = useAuth();
  const isAdmin = has({ role: "org:admin" });

  const { mutate: retireEq, isPending } = useRetireEquipmentMutation();

  async function handleRetire(unit_number: string) {
    startTransition(async () => {
      onRetire();
      retireEq(unit_number);
    });
  }

  if (!isAdmin) return null;
  return (
    <Button
      type="button"
      variant="destructive"
      className="text-destructive hover:bg-destructive/10"
      onClick={() => {
        handleRetire(unit_number);
      }}
      disabled={isPending}
    >
      Retire
    </Button>
  );
}
