"use client";
import { CornerDownLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { useReturnMutation } from "@/mutations/transactions";
import { Button } from "../ui/button";

export default function ReturnButton({
  equipment_unit,
}: {
  equipment_unit: string;
}) {
  const { mutate: returnItem, isPending } = useReturnMutation();

  async function handleReturn(unit_number: string) {
<<<<<<< Updated upstream
    returnItem(unit_number, {
      onSuccess: () =>
        toast.success(`Successfully returned unit ${unit_number}`),
      onError: (error: Error) => toast.error(error.message),
=======
    startTransition(async () => {
      onReturn(unit_number);
      returnItem(unit_number);
>>>>>>> Stashed changes
    });
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
