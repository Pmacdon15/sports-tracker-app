import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useDeleteEquipmentMutation } from "@/mutations/equipment";
import { Button } from "../ui/button";

export function InventoryDeleteButton({
  unit_number,
}: {
  unit_number: string;
}) {
  const { has } = useAuth();
  const isAdmin = has({ role: "org:admin" });

  const { mutate: deleteEq, isPending } = useDeleteEquipmentMutation();

<<<<<<< Updated upstream
=======
  function handleDelete(unit_number: string) {
    startTransition(async () => {
      onDelete();
      deleteEq(unit_number);
    });
  }
>>>>>>> Stashed changes
  if (!isAdmin) return null;
  return (
    <Button
      type="button"
      variant="destructive"
      // size="icon"
      className="text-destructive hover:bg-destructive/10"
      onClick={() => {
        deleteEq(unit_number, {
          onSuccess: () => toast.success(`Deleted equipment ${unit_number}`),
          onError: (error: Error) => toast.error(error.message),
        });
      }}
      disabled={isPending}
    >
      Delete
    </Button>
  );
}
