import { redirect } from "next/navigation";

export type ActionErrorReason =
  | "Unauthorized"
  | "Equipment not found and no type provided for creation."
  | "Equipment not found."
  | "Equipment is not checked out."
  | "Failed to create or retrieve guest."
  | "Over organization membership limit."
  | "Unknown error."
  | "Equipment is not available"
  | "Failed to add equipment"
  | "Failed to delete equipment"
  | "Failed to retire equipment"
  | "Failed to add unit type"
  | "Failed to update setting"
  | "Validation failed"
  | "Test";

export interface ActionError {
  reason: ActionErrorReason;
  message?: string;
}

export function handleMutationError(error: ActionError) {
  const { reason, message } = error;

  switch (reason) {
    case "Unauthorized":
      redirect("/");
      break;
    case "Equipment not found and no type provided for creation.":
      return {
        message:
          message ||
          "Equipment not found and no type was provided to create a new one.",
      };
    case "Equipment not found.":
      return {
        message: message || "The requested equipment could not be found.",
      };
    case "Equipment is not checked out.":
      return {
        message: message || "This equipment is not currently checked out.",
      };
    case "Failed to create or retrieve guest.":
      return {
        message:
          message || "There was an error processing the guest information.",
      };
    case "Over organization membership limit.":
      return {
        message:
          message || "Your organization has reached its membership limit.",
      };
    case "Equipment is not available":
      return {
        message:
          message ||
          "This equipment is already checked out or otherwise unavailable.",
      };
    case "Failed to add equipment":
      return {
        message: message || "Could not add the new equipment to the system.",
      };
    case "Failed to delete equipment":
      return { message: message || "Failed to delete the equipment." };
    case "Failed to retire equipment":
      return { message: message || "Failed to retire the equipment." };
    case "Failed to add unit type":
      return { message: message || "Failed to add the unit type." };
    case "Failed to update setting":
      return { message: message || "Failed to update the setting." };
    case "Unknown error.":
      return {
        message: message || "An unexpected error occurred. Please try again.",
      };
    case "Validation failed": {
      return {
        message: message || "Form validation failed",
      };
    }
    case "Test":
      return { message: message || "This is a test error message." };
    default:
      // Exhaustive check
      throw new Error(`Unhandled error reason: ${reason satisfies never}`);
  }
}
