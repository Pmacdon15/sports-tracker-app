"use server";

import { okAsync } from "neverthrow";
import { updateTag } from "next/cache";
import {
  addEquipment,
  deleteEquipment,
  retireEquipment,
} from "@/dal/equipment";
import { handleMutationError } from "./utils";

export async function addEquipmentAction(type: string, unit_number: string) {
  const res = await addEquipment(type, unit_number);
  return res.match((data) => {
    updateTag(`equipment-${data.org_id}`);
    return okAsync(data);
  }, handleMutationError);
}

export async function deleteEquipmentAction(unit_number: string) {
  const res = await deleteEquipment(unit_number);
  return res.match((data) => {
    updateTag(`equipment-${data.org_id}`);
    return { value: data };
  }, handleMutationError);
}

export async function retireEquipmentAction(unit_number: string) {
  const res = await retireEquipment(unit_number);
  return res.match((data) => {
    updateTag(`equipment-${data.org_id}`);
    return { value: data };
  }, handleMutationError);
}
