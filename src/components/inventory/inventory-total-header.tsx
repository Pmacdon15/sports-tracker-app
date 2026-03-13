import { CardTitle } from "../ui/card";

export default async function InventoryTotalHeader({
  equipmentLengthPromise,
}: {
  equipmentLengthPromise: Promise<number>;
}) {
  const eqLength = await equipmentLengthPromise;
  return <CardTitle>Current Inventory ({eqLength})</CardTitle>;
}
