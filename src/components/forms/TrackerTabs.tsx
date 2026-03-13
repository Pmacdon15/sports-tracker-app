"use client";

import type * as React from "react";
import { Suspense } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Equipment } from "@/data/equipment";
import type { Guest } from "@/data/guests";
import type { Transaction } from "@/data/transactions";
import CheckoutTabFallback from "../fallbacks/checkout-tab-fallback";
import CheckoutTab from "../tabs/check-out";
import ReturnsTab from "../tabs/returns";

export function TrackerTabs({
  activeTab,
  completedRentalsPromise,
  equipmentPromise,
  guestsPromise,
  initialDatePromise,
}: {
  activeTab: React.ReactNode;
  completedRentalsPromise: Promise<Transaction[]>;
  equipmentPromise: Promise<Equipment[]>;
  guestsPromise: Promise<Guest[]>;
  initialDatePromise: Promise<string | undefined>;
}) {
  return (
    <Tabs defaultValue="checkout" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="checkout">Checkout</TabsTrigger>
        <TabsTrigger value="active">Who's Out</TabsTrigger>
        <TabsTrigger value="returns">Recent Returns</TabsTrigger>
      </TabsList>

      <Suspense fallback={<CheckoutTabFallback />}>
        <CheckoutTab
          equipmentPromise={equipmentPromise}
          guestsPromise={guestsPromise}
        />
      </Suspense>

      {activeTab}

      <Suspense>
        <ReturnsTab
          completedRentalsPromise={completedRentalsPromise}
          initialDatePromise={initialDatePromise}
        />
      </Suspense>
    </Tabs>
  );
}
