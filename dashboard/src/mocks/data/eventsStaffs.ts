import { nanoid } from "nanoid";
import type { EventStaff } from "../../features/events/types";

// ==========================================
// 🎫 EventsStaffs Mock Data (API-Compliant)
// ==========================================

/**
 * Mock EventsStaffs Data - Per API Instructions
 * - ID: Nano UUID (string) format "es_XXXXX"
 * - registration_check_id: NULL until staff is registered, then FK to checks.id
 * - CPF: Stored as digits only (no formatting)
 * - created_at/created_by: Audit fields
 */
export let mockEventsStaffs: EventStaff[] = [
  // ========================================
  // Event 1 - Rock Festival 2026
  // ========================================

  // João Silva - Registered and had check-ins
  {
    id: "es_V1StGXR8_Z5jdHi6B",
    event_id: 1,
    staff_id: 1,
    staff_cpf: "12345678900", // João Silva (no formatting)
    registration_check_id: 1, // Registered (see checks.ts)
    created_at: "2026-01-14T10:00:00Z",
    created_by: 2, // Maria Santos (company user)
  },

  // Maria Santos - Registered and checked in (still inside)
  {
    id: "es_K3pL9xR2_M8nQwEr",
    event_id: 1,
    staff_id: 2,
    staff_cpf: "98765432100",
    registration_check_id: 4, // Registered
    created_at: "2026-01-14T10:05:00Z",
    created_by: 2,
  },

  // Pedro Oliveira - Only registered, never checked in
  {
    id: "es_P7yT4vN1_H6kLmZx",
    event_id: 1,
    staff_id: 3,
    staff_cpf: "11122233344",
    registration_check_id: 6, // Registered
    created_at: "2026-01-14T10:10:00Z",
    created_by: 3, // Pedro Oliveira (company user from Beta)
  },

  // ========================================
  // Event 2 - Tech Summit 2026
  // ========================================

  // Ana Costa - Full cycle completed
  {
    id: "es_W2aB8cD5_R9tYuIo",
    event_id: 2,
    staff_id: 4,
    staff_cpf: "55566677788",
    registration_check_id: 7, // Registered
    created_at: "2026-01-17T09:00:00Z",
    created_by: 3,
  },

  // Carlos Souza - Registered only
  {
    id: "es_F5gH3jK8_L2mNpQw",
    event_id: 2,
    staff_id: 5,
    staff_cpf: "99988877766",
    registration_check_id: 10, // Registered
    created_at: "2026-01-17T09:15:00Z",
    created_by: 4, // Ana Costa
  },

  // Pedro Oliveira - Assigned but NOT registered yet
  {
    id: "es_A1bC2dE3_F4gH5iJ6",
    event_id: 2,
    staff_id: 3,
    staff_cpf: "11122233344",
    registration_check_id: null, // NOT REGISTERED - Should block check-in
    created_at: "2026-01-17T09:30:00Z",
    created_by: 3,
  },

  // ========================================
  // Event 3 - Corporate Event 2026
  // ========================================

  // Lucia Ferreira - Registered and checked in
  {
    id: "es_X9zC4vB6_N8mKlPo",
    event_id: 3,
    staff_id: 6,
    staff_cpf: "44455566677",
    registration_check_id: 11, // Registered
    created_at: "2026-01-18T08:00:00Z",
    created_by: 5, // Carlos Ferreira (company user)
  },

  // Rafael Alves - Multiple check-ins (in/out/in/out)
  {
    id: "es_Q2wE7rT9_Y5uIoAq",
    event_id: 3,
    staff_id: 7,
    staff_cpf: "33344455566",
    registration_check_id: 13, // Registered
    created_at: "2026-01-18T08:05:00Z",
    created_by: 5,
  },

  // Juliana Lima - Registered but not checked in yet
  {
    id: "es_Z7xN3mK9_L4pQwRt",
    event_id: 3,
    staff_id: 8,
    staff_cpf: "22233344455",
    registration_check_id: 18, // Registered
    created_at: "2026-01-18T08:10:00Z",
    created_by: 6, // Juliana Lima (company user)
  },

  // ========================================
  // Event 4 - New Year Corporate Event
  // ========================================

  // João Silva - Assigned but NOT registered
  {
    id: "es_M5nK8pL2_Q9wXvYz",
    event_id: 4,
    staff_id: 1,
    staff_cpf: "12345678900",
    registration_check_id: null, // NOT REGISTERED
    created_at: "2026-01-19T14:00:00Z",
    created_by: 2,
  },

  // Carlos Ferreira - Assigned but NOT registered
  {
    id: "es_B4vC9xN7_M2kLpJh",
    event_id: 4,
    staff_id: 5,
    staff_cpf: "99988877766",
    registration_check_id: null, // NOT REGISTERED
    created_at: "2026-01-19T14:05:00Z",
    created_by: 5,
  },

  // Roberto Alves - Assigned but NOT registered
  {
    id: "es_R8tY3uI9_O5pAsD2",
    event_id: 4,
    staff_id: 7,
    staff_cpf: "33344455566",
    registration_check_id: null, // NOT REGISTERED
    created_at: "2026-01-19T14:10:00Z",
    created_by: 6,
  },

  // ========================================
  // Event 5 - Business Fair
  // ========================================

  // Ana Costa - Assigned but NOT registered
  {
    id: "es_T6yU7iO8_P9aQwE1",
    event_id: 5,
    staff_id: 4,
    staff_cpf: "55566677788",
    registration_check_id: null, // NOT REGISTERED
    created_at: "2026-01-19T16:00:00Z",
    created_by: 3,
  },

  // Roberto Alves - Assigned but NOT registered
  {
    id: "es_G3hJ4kL5_M6nBvC8",
    event_id: 5,
    staff_id: 7,
    staff_cpf: "33344455566",
    registration_check_id: null, // NOT REGISTERED
    created_at: "2026-01-19T16:05:00Z",
    created_by: 6,
  },

  // Fernanda Souza - Assigned but NOT registered
  {
    id: "es_D1fG2hJ3_K4lMnN5",
    event_id: 5,
    staff_id: 8,
    staff_cpf: "22233344455",
    registration_check_id: null, // NOT REGISTERED
    created_at: "2026-01-19T16:10:00Z",
    created_by: 8, // Fernanda Souza (company user)
  },

  // ========================================
  // Event 6 - Charity Show (CLOSED)
  // ========================================

  // João Silva - Event closed (no registration data)
  {
    id: "es_Y9zX8cV7_B6nM5kL",
    event_id: 6,
    staff_id: 1,
    staff_cpf: "12345678900",
    registration_check_id: null,
    created_at: "2025-12-20T10:00:00Z",
    created_by: 2,
  },

  // Maria Santos - Event closed
  {
    id: "es_H4jK5lM6_N7pQwR8",
    event_id: 6,
    staff_id: 2,
    staff_cpf: "98765432100",
    registration_check_id: null,
    created_at: "2025-12-20T10:05:00Z",
    created_by: 2,
  },

  // Fernanda Souza - Event closed
  {
    id: "es_S2dF3gH4_J5kLmN6",
    event_id: 6,
    staff_id: 8,
    staff_cpf: "22233344455",
    registration_check_id: null,
    created_at: "2025-12-20T10:10:00Z",
    created_by: 8,
  },
];

/**
 * Helper function to reset mock events_staff to initial state.
 */
export const resetMockEventsStaffs = () => {
  mockEventsStaffs = [
    {
      id: "es_V1StGXR8_Z5jdHi6B",
      event_id: 1,
      staff_id: 1,
      staff_cpf: "12345678900",
      registration_check_id: 1,
      created_at: "2026-01-14T10:00:00Z",
      created_by: 2,
    },
    {
      id: "es_K3pL9xR2_M8nQwEr",
      event_id: 1,
      staff_id: 2,
      staff_cpf: "98765432100",
      registration_check_id: 4,
      created_at: "2026-01-14T10:05:00Z",
      created_by: 2,
    },
    {
      id: "es_P7yT4vN1_H6kLmZx",
      event_id: 1,
      staff_id: 3,
      staff_cpf: "11122233344",
      registration_check_id: 6,
      created_at: "2026-01-14T10:10:00Z",
      created_by: 3,
    },
    {
      id: "es_W2aB8cD5_R9tYuIo",
      event_id: 2,
      staff_id: 4,
      staff_cpf: "55566677788",
      registration_check_id: 7,
      created_at: "2026-01-17T09:00:00Z",
      created_by: 3,
    },
    {
      id: "es_F5gH3jK8_L2mNpQw",
      event_id: 2,
      staff_id: 5,
      staff_cpf: "99988877766",
      registration_check_id: 10,
      created_at: "2026-01-17T09:15:00Z",
      created_by: 4,
    },
    {
      id: "es_A1bC2dE3_F4gH5iJ6",
      event_id: 2,
      staff_id: 3,
      staff_cpf: "11122233344",
      registration_check_id: null,
      created_at: "2026-01-17T09:30:00Z",
      created_by: 3,
    },
    {
      id: "es_X9zC4vB6_N8mKlPo",
      event_id: 3,
      staff_id: 6,
      staff_cpf: "44455566677",
      registration_check_id: 11,
      created_at: "2026-01-18T08:00:00Z",
      created_by: 5,
    },
    {
      id: "es_Q2wE7rT9_Y5uIoAq",
      event_id: 3,
      staff_id: 7,
      staff_cpf: "33344455566",
      registration_check_id: 13,
      created_at: "2026-01-18T08:05:00Z",
      created_by: 5,
    },
    {
      id: "es_Z7xN3mK9_L4pQwRt",
      event_id: 3,
      staff_id: 8,
      staff_cpf: "22233344455",
      registration_check_id: 18,
      created_at: "2026-01-18T08:10:00Z",
      created_by: 6,
    },
    {
      id: "es_M5nK8pL2_Q9wXvYz",
      event_id: 4,
      staff_id: 1,
      staff_cpf: "12345678900",
      registration_check_id: null,
      created_at: "2026-01-19T14:00:00Z",
      created_by: 2,
    },
    {
      id: "es_B4vC9xN7_M2kLpJh",
      event_id: 4,
      staff_id: 5,
      staff_cpf: "99988877766",
      registration_check_id: null,
      created_at: "2026-01-19T14:05:00Z",
      created_by: 5,
    },
    {
      id: "es_R8tY3uI9_O5pAsD2",
      event_id: 4,
      staff_id: 7,
      staff_cpf: "33344455566",
      registration_check_id: null,
      created_at: "2026-01-19T14:10:00Z",
      created_by: 6,
    },
    {
      id: "es_T6yU7iO8_P9aQwE1",
      event_id: 5,
      staff_id: 4,
      staff_cpf: "55566677788",
      registration_check_id: null,
      created_at: "2026-01-19T16:00:00Z",
      created_by: 3,
    },
    {
      id: "es_G3hJ4kL5_M6nBvC8",
      event_id: 5,
      staff_id: 7,
      staff_cpf: "33344455566",
      registration_check_id: null,
      created_at: "2026-01-19T16:05:00Z",
      created_by: 6,
    },
    {
      id: "es_D1fG2hJ3_K4lMnN5",
      event_id: 5,
      staff_id: 8,
      staff_cpf: "22233344455",
      registration_check_id: null,
      created_at: "2026-01-19T16:10:00Z",
      created_by: 8,
    },
    {
      id: "es_Y9zX8cV7_B6nM5kL",
      event_id: 6,
      staff_id: 1,
      staff_cpf: "12345678900",
      registration_check_id: null,
      created_at: "2025-12-20T10:00:00Z",
      created_by: 2,
    },
    {
      id: "es_H4jK5lM6_N7pQwR8",
      event_id: 6,
      staff_id: 2,
      staff_cpf: "98765432100",
      registration_check_id: null,
      created_at: "2025-12-20T10:05:00Z",
      created_by: 2,
    },
    {
      id: "es_S2dF3gH4_J5kLmN6",
      event_id: 6,
      staff_id: 8,
      staff_cpf: "22233344455",
      registration_check_id: null,
      created_at: "2025-12-20T10:10:00Z",
      created_by: 8,
    },
  ];
};

/**
 * Generate a new EventStaff Nano UUID ID
 */
export function generateEventStaffId(): string {
  return `es_${nanoid(18)}`;
}
