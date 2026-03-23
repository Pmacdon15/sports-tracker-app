"use client";
import { CornerDownLeftIcon } from "lucide-react";
import { startTransition } from "react";
import { useReturnMutation } from "@/mutations/transactions";
import { Button } from "../ui/button";

export default function ReturnButton({
  equipment_unit,
  onReturn,
}: {
  equipment_unit: string;
  onReturn: (action: string) => void;
}) {
  const { mutate: returnItem, isPending } = useReturnMutation();

  async function handleReturn(unit_number: string) {
    startTransition(async () => {
      onReturn(unit_number);
    });
    returnItem(unit_number);
  }
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleReturn(equipment_unit)}
      disabled={isPending}
      className="border-primary/50 text-primary hover:bg-primary/10"
    >
      <CornerDownLeftIcon className="w-4 h-4 mr-2" />
      Return
    </Button>
  );
}
