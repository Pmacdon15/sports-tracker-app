import { NextResponse } from "next/server";
import { getAllOrganizationsWithLimits } from "@/dal/organizations";
import {
  rebalanceEquipmentDb,
  triggerOverLimitWorkflowIfNecessaryDb,
} from "@/db/equipment";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgs = await getAllOrganizationsWithLimits();
    console.log(
      `[CRON] Rebalancing equipment for ${orgs.length} organizations`,
    );

    for (const org of orgs) {
      try {
        const limit = org.equipmentLimit;
        console.log(`[CRON] Org ${org.org_id} has limit: ${limit}`);

        // Then trigger workflow if still (or newly) over limit
        const { is_over } = await triggerOverLimitWorkflowIfNecessaryDb(
          org.org_id,
          limit,
        );
        if (!is_over) await rebalanceEquipmentDb(org.org_id, limit);
      } catch (orgError) {
        console.error(`[CRON] Error processing org ${org.org_id}:`, orgError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${orgs.length} organizations.`,
    });
  } catch (error) {
    console.error("[CRON] Error in rebalance-equipment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
