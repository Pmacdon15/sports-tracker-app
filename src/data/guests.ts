import { auth } from "@clerk/nextjs/server";
import { sql } from "@vercel/postgres";

export interface Guest {
  id: number;
  name: string;
  org_id: string;
  created_at: Date;
}

export async function getAllGuests(): Promise<Guest[]> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  const res =
    await sql`SELECT * FROM guests WHERE org_id = ${orgId} ORDER BY name ASC`;
  return res.rows as Guest[];
}

export async function searchGuests(queryStr: string): Promise<Guest[]> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  const searchParam = `%${queryStr}%`;
  const res =
    await sql`SELECT * FROM guests WHERE name ILIKE ${searchParam} AND org_id = ${orgId} ORDER BY name ASC`;
  return res.rows as Guest[];
}

export async function getGuestByName(name: string): Promise<Guest | null> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  const res =
    await sql`SELECT * FROM guests WHERE name = ${name} AND org_id = ${orgId}`;
  return res.rows[0] ? (res.rows[0] as Guest) : null;
}

export async function getOrCreateGuest(name: string): Promise<Guest> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  // First attempt to find them
  const existing = await getGuestByName(name);
  if (existing) return existing;

  // Insert otherwise
  const res = await sql`
    INSERT INTO guests (name, org_id) 
    VALUES (${name}, ${orgId}) 
    ON CONFLICT (name, org_id) DO NOTHING 
    RETURNING *
  `;

  if (!res.rows[0]) {
    const fallback = await getGuestByName(name);
    if (fallback) return fallback;
    throw new Error("Failed to create or retrieve guest");
  }

  return res.rows[0] as Guest;
}
