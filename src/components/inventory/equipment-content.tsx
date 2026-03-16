import { EquipmentList } from "@/components/inventory/client";
import type { DbResult, Equipment } from "@/db/types";
import { CardContent } from "../ui/card";

export default async function EquipmentContent({
  equipmentPromise,
}: {
  equipmentPromise: Promise<DbResult<Equipment[]>>;
}) {
  const { data: equipment, error } = await equipmentPromise;

  if (error !== null) {
    return (
      <CardContent className="py-12 text-center text-destructive">
        {error}
      </CardContent>
    );
  }

  if (equipment.length < 1) {
    return (
      <CardContent className="py-12 text-center text-destructive">
        Please add Equipment
      </CardContent>
    );
  }

  return <EquipmentList initialEquipment={equipment} />;
}
