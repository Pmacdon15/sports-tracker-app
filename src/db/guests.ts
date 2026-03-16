import { cacheTag } from "next/cache";
import { getSql } from "./db";
import type { GlobalGuestStats, Guest, GuestStats } from "./types";

export async function getAllGuestsDb(orgId: string): Promise<Guest[]> {
  const sql = getSql();
  const res = await sql`
    SELECT * FROM guests 
    WHERE org_id = ${orgId} 
    ORDER BY name ASC
  `;
  return res as unknown as Guest[];
}

export async function getGuestByNameDb(
  orgId: string,
  name: string,
): Promise<Guest | null> {
  const sql = getSql();
  const res = await sql`
    SELECT * FROM guests 
    WHERE name = ${name} AND org_id = ${orgId}
  `;
  return (res[0] as unknown as Guest) || null;
}

export async function createGuestDb(
  orgId: string,
  name: string,
): Promise<Guest> {
  const sql = getSql();
  const res = await sql`
    INSERT INTO guests (name, org_id) 
    VALUES (${name}, ${orgId}) 
    ON CONFLICT (name, org_id) DO NOTHING 
    RETURNING *
  `;
  return res[0] as unknown as Guest;
}

export async function getGuestStatsDb(
  orgId: string,
  limit = 20,
  offset = 0,
): Promise<GuestStats[]> {
  const sql = getSql();
  const res = await sql`
    SELECT 
      g.id, 
      g.name, 
      COUNT(t.id)::int as trip_count,
      MAX(t.checked_out_at) as last_trip_at
    FROM guests g
    LEFT JOIN transactions t ON g.id = t.guest_id
    WHERE g.org_id = ${orgId}
    GROUP BY g.id, g.name
    ORDER BY trip_count DESC, g.name ASC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return res as unknown as GuestStats[];
}

export async function getGlobalGuestStatsDb(
  orgId: string,
): Promise<GlobalGuestStats> {
  "use cache";
  cacheTag(`guest-stats-${orgId}`);
  const sql = getSql();
  const res = await sql`
    SELECT 
      COUNT(DISTINCT g.id)::int as total_guests,
      COUNT(t.id)::int as total_trips,
      CASE 
        WHEN COUNT(DISTINCT g.id) = 0 THEN 0 
        ELSE (COUNT(t.id)::float / COUNT(DISTINCT g.id)::float)
      END as avg_trips_per_guest
    FROM guests g
    LEFT JOIN transactions t ON g.id = t.guest_id
    WHERE g.org_id = ${orgId}
  `;
  return res[0] as unknown as GlobalGuestStats;
}

export function getMockGuestStats(page = 1, limit = 20): GuestStats[] {
  const firstNames = [
    "John",
    "Jane",
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Edward",
    "Fiona",
    "George",
    "Hannah",
  ];
  const lastNames = [
    "Smith",
    "Doe",
    "Johnson",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
  ];

  // Use a fixed seed-like approach for stable mock data
  const data: GuestStats[] = Array.from({ length: 300 }, (_, i) => {
    const nameIndex = i % (firstNames.length * lastNames.length);
    const firstName = firstNames[Math.floor(nameIndex / lastNames.length)];
    const lastName = lastNames[nameIndex % lastNames.length];

    // Somewhat stable trip count
    const trip_count = ((i * 7) % 50) + 1;

    // Stable date
    const last_trip_at = new Date(Date.now() - (i % 180) * 1000 * 60 * 60 * 24);

    return {
      id: i + 1,
      name: `${firstName} ${lastName} #${i + 1}`,
      trip_count,
      last_trip_at,
    };
  });

  // Sort by trip count descending
  const sortedData = data.sort((a, b) => b.trip_count - a.trip_count);

  // Return the specific page
  const offset = (page - 1) * limit;
  return sortedData.slice(offset, offset + limit);
}
