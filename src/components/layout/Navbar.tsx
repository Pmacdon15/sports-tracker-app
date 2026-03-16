"use client";

import {
  OrganizationSwitcher,
  Show,
  SignInButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Dumbbell, Menu } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { has } = useAuth();
  const isAdmin = has({ role: "org:admin" });

  // 1. Get Local Date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  // 2. Get Timezone (Memoized to prevent recalculation)
  const timezone = React.useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  // 3. Helper to build the encoded URL
  const getTrackerPath = React.useCallback(() => {
    const params = new URLSearchParams();
    params.set("date", today);
    params.set("timezone", timezone);
    return `/tracker?${params.toString()}`;
  }, [today, timezone]);

  const NavLinks = () => (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href="/">Home</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href="/plans">Plans</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <Show when="signed-in">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            {/* Encoded Link */}
            <Link href={getTrackerPath()}>Tracker</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/inventory">Inventory</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {isAdmin && (
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/settings">Settings</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </Show>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <Link
            href="/"
            className="font-bold text-lg text-primary tracking-tight"
          >
            Sports Tracker
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavLinks />
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2 ml-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <OrganizationSwitcher
                appearance={{
                  elements: {
                    organizationSwitcherTrigger:
                      "focus:ring-0 focus:ring-offset-0",
                  },
                }}
              />
              <UserButton />
            </Show>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <OrganizationSwitcher
              hidePersonal={false}
              appearance={{
                elements: {
                  organizationSwitcherTrigger:
                    "focus:ring-0 focus:ring-offset-0",
                },
              }}
            />
            <UserButton />
          </Show>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="px-0 text-base hover:bg-transparent"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetHeader>
                <SheetTitle className="text-left font-bold text-primary flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Sports Tracker
                </SheetTitle>
              </SheetHeader>
              <div className="my-8 flex flex-col gap-4 text-sm">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-primary pl-1 font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/plans"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-primary pl-1 font-medium"
                >
                  Plans
                </Link>
                <Show when="signed-in">
                  {/* Encoded Link for Mobile */}
                  <Link
                    href={getTrackerPath()}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-primary pl-1 font-medium"
                  >
                    Tracker
                  </Link>
                  <Link
                    href="/inventory"
                    onClick={() => setIsOpen(false)}
                    className="hover:text-primary pl-1 font-medium"
                  >
                    Inventory
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/settings"
                      onClick={() => setIsOpen(false)}
                      className="hover:text-primary pl-1 font-medium"
                    >
                      Settings
                    </Link>
                  )}
                </Show>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
