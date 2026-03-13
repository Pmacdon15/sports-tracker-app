"use client";
import { useMutation } from "@tanstack/react-query";
import { CornerDownLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { processReturn } from "@/app/actions";
import { Button } from "../ui/button";

export default function ReturnButton({
  equipment_unit,
}: {
  equipment_unit: string;
}) {
  const returnMutation = useMutation({
    mutationFn: async (unit_number: string) => {
      const result = await processReturn({ unit_number });
      if (!result?.success)
        throw new Error(result?.message || "Error returning item");
      return result;
    },
    onSuccess: (data) => toast.success(data.message),
    onError: (error: Error) => toast.error(error.message),
  });

  async function handleReturn(unit_number: string) {
    returnMutation.mutate(unit_number);
  }
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleReturn(equipment_unit)}
      disabled={returnMutation.isPending}
      className="border-primary/50 text-primary hover:bg-primary/10"
    >
      <CornerDownLeftIcon className="w-4 h-4 mr-2" />
      Return
    </Button>
  );
}
