import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define which routes require a login
const isProtectedRoute = createRouteMatcher([
  "/tracker(.*)",
  "/settings(.*)",
  "/inventory(.*)",
  "/experimental(.*)",
  "/guests(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/settings(.*)",
  "/experimental(.*)",
  "/guests(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { has } = await auth.protect();

    if (isAdminRoute(req)) {
      const isAdmin = await has({ role: "org:admin" });

      const isFreePlan = await has({ plan: "free" });
      const isExperimental = req.nextUrl.pathname.startsWith("/experimental");

      if (!isAdmin || (isExperimental && isFreePlan)) {
        return Response.redirect(new URL("/", req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    // Standard Next.js/Clerk middleware matcher
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
