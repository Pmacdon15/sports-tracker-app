import { useAuth } from "@clerk/nextjs";
import { startTransition } from "react";
import { useDeleteEquipmentMutation } from "@/mutations/equipment";
import { Button } from "../ui/button";

export function InventoryDeleteButton({
  unit_number,
  onDelete,
}: {
  unit_number: string;
  onDelete: () => void;
}) {
  const { has } = useAuth();
  const isAdmin = has({ role: "org:admin" });

  const { mutate: deleteEq, isPending } = useDeleteEquipmentMutation();

  function handleDelete(unit_number: string) {
    startTransition(async () => {
      onDelete();
      deleteEq(unit_number);
    });
  }
  if (!isAdmin) return null;
  return (
    <Button
      type="button"
      variant="destructive"
      // size="icon"
      className="text-destructive hover:bg-destructive/10"
      onClick={() => {
        handleDelete(unit_number);
      }}
      disabled={isPending}
    >
      Delete
    </Button>
  );
}
