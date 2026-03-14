import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/tracker(.*)",
  "/settings(.*)",
  "/inventory(.*)",
  "/experimental(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { has } = await auth.protect();

    if (req.nextUrl.pathname.startsWith("/experimental")) {
      if (!(await has({ role: "org:admin" })) || !(await has({ plan: "free" })))
        return Response.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc|tracker|settings|inventory|experimental)(.*)",
  ],
};
