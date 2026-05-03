import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // Ensure return_photo_url exists
  await sql`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS return_photo_url VARCHAR(1024);`;

  // Try dropping return_photo_urls if it exists
  try {
    await sql`ALTER TABLE transactions DROP COLUMN IF EXISTS return_photo_urls;`;
  } catch(e) {}

  console.log("Migration reverted to single photo.");
}

main().catch(console.error);
