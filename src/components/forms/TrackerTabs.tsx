"use client";

import type * as React from "react";
import { Suspense } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  DbResult,
  Equipment,
  Guest,
  Transaction,
  UnitType,
} from "@/db/types";
import CheckoutTabFallback from "../fallbacks/checkout-tab-fallback";
import ReturnsTabFallback from "../fallbacks/returns-tab-fallback";
import CheckoutTab from "../tabs/check-out";
import ReturnsTab from "../tabs/returns";

export function TrackerTabs({
  activeTab,
  completedRentalsPromise,
  equipmentPromise,
  equipmentTypePromise,
  guestsPromise,
  initialDatePromise,
  settingsPromise,
}: {
  activeTab: React.ReactNode;
  completedRentalsPromise: Promise<DbResult<Transaction[]>>;
  equipmentPromise: Promise<DbResult<Equipment[]>>;
  equipmentTypePromise: Promise<DbResult<UnitType[]>>;
  guestsPromise: Promise<DbResult<Guest[]>>;
  initialDatePromise: Promise<string | undefined>;
  settingsPromise: Promise<DbResult<Record<string, string>>>;
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
          equipmentTypePromise={equipmentTypePromise}
          equipmentPromise={equipmentPromise}
          guestsPromise={guestsPromise}
        />
      </Suspense>

      {activeTab}

      <Suspense fallback={<ReturnsTabFallback />}>
        <ReturnsTab
          completedRentalsPromise={completedRentalsPromise}
          initialDatePromise={initialDatePromise}
          settingsPromise={settingsPromise}
        />
      </Suspense>
    </Tabs>
  );
}
