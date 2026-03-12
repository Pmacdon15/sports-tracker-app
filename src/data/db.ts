import { sql } from "@vercel/postgres";

export const query = sql;
export const getClient = async () =>
  "Not available in vercel/postgres serverless edge. Use direct sql calls.";
