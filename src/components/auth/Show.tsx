"use client";
import { useAuth } from "@clerk/nextjs";

export function Show({
  when,
  children,
}: {
  when: "signedIn" | "signedOut";
  children: React.ReactNode;
}) {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) return null;

  if (when === "signedIn" && userId) {
    return <>{children}</>;
  }

  if (when === "signedOut" && !userId) {
    return <>{children}</>;
  }

  return null;
}
