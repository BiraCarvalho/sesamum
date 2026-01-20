// Event type based on copilot-instructions
export interface Event {
  id: number;
  name: string;
  description?: string;
  date_begin: string;
  date_end: string;
  status: "open" | "close" | "pending";
  project_id?: number;
  type?: "event" | "project";
  location?: string;
  staffs_qnt?: number;
  companies?: EventCompany[];
}

export interface EventCompany {
  id: number;
  role: "production" | "service";
  event_id: number;
  company_id: number;
}

/**
 * EventStaff - Staff-to-Event assignment with credentialing control
 * Per API instructions: ID is Nano UUID, registration_check_id controls check-in/out access
 */
export interface EventStaff {
  id: string; // Nano UUID (e.g., "es_V1StGXR8_Z5jdHi6B")
  event_id: number;
  staff_id: number;
  staff_cpf: string; // Redundant field for fast lookup
  registration_check_id: number | null; // FK to checks table - NULL means not yet registered
  created_at: string;
  created_by: number; // User ID who created the assignment
  lastCheck?: Check; // Optional: last check for UI display
}

export interface EventUser {
  id: number;
  user_id: number;
  event_id: number;
}

/**
 * @deprecated Use Check from shared/types instead
 * Kept for backward compatibility
 */
export interface Check {
  id: number;
  action: "check-in" | "check-out";
  timestamp: string;
  events_staff_id: number;
  user_control_id: number;
}
