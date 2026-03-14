"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function TimezoneRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const params = new URLSearchParams(searchParams.toString());
    params.set("timezone", tz);
    if (!params.has("date")) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      params.set("date", `${year}-${month}-${day}`);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);
  return null;
  // return (
  //   <div className="flex-1 flex items-center justify-center">
  //     <div className="animate-pulse text-muted-foreground">
  //       Detecting timezone and loading tracker...
  //     </div>
  //   </div>
  // );
}
