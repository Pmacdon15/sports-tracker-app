export interface Equipment {
  id: number;
  type: string;
  unit_number: string;
  org_id: string;
  status: "AVAILABLE" | "CHECKED_OUT" | "RETIRED";
  created_at: Date;
}

export interface Guest {
  id: number;
  name: string;
  org_id: string;
  created_at: Date;
}

export interface Transaction {
  id: number;
  equipment_id: number;
  guest_id: number;
  org_id: string;
  checked_out_at: Date;
  checked_in_at: Date | null;
  status: "OUT" | "RETURNED";
  equipment_unit?: string;
  equipment_type?: string;
  guest_name?: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  org_id: string;
  updated_at: Date;
}

export interface Organization {
  org_id: string;
  name: string;
  equipment_limit: number;
  created_at: Date;
}

export interface ExperimentalFeature {
  org_id: string;
  feature_name: string;
  is_enabled: boolean;
  api_key: string | null;
  updated_at: Date;
}

export interface SystemFeature {
  name: string;
  description: string | null;
  created_at: Date;
}

export type DbResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };
