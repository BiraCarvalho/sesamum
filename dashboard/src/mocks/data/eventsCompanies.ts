import type { EventCompany } from "../../types";

/**
 * Mock EventsCompanies Data
 * Represents the events_company relationship table
 * Links companies to events with their role (production or service)
 */
export let mockEventsCompanies: EventCompany[] = [
  // Event 1 - Festival de Música 2024
  { id: 1, event_id: 1, company_id: 1, role: "production" },
  { id: 2, event_id: 1, company_id: 6, role: "service" },

  // Event 2 - Conferência Tech Brasil
  { id: 3, event_id: 2, company_id: 2, role: "production" },
  { id: 4, event_id: 2, company_id: 6, role: "service" },

  // Event 3 - Workshop de Design
  { id: 5, event_id: 3, company_id: 1, role: "production" },
  { id: 6, event_id: 3, company_id: 5, role: "service" },

  // Event 4 - Evento Corporativo - Ano Novo
  { id: 7, event_id: 4, company_id: 3, role: "production" },
  { id: 8, event_id: 4, company_id: 4, role: "service" },

  // Event 5 - Feira de Negócios
  { id: 9, event_id: 5, company_id: 2, role: "production" },
  { id: 10, event_id: 5, company_id: 4, role: "service" },
  { id: 11, event_id: 5, company_id: 6, role: "service" },

  // Event 6 - Show Beneficente (closed)
  { id: 12, event_id: 6, company_id: 5, role: "production" },
  { id: 13, event_id: 6, company_id: 1, role: "service" },
];

/**
 * Helper function to reset mock events_company to initial state.
 */
export const resetMockEventsCompanies = () => {
  mockEventsCompanies = [
    { id: 1, event_id: 1, company_id: 1, role: "production" },
    { id: 2, event_id: 1, company_id: 6, role: "service" },
    { id: 3, event_id: 2, company_id: 2, role: "production" },
    { id: 4, event_id: 2, company_id: 6, role: "service" },
    { id: 5, event_id: 3, company_id: 1, role: "production" },
    { id: 6, event_id: 3, company_id: 5, role: "service" },
    { id: 7, event_id: 4, company_id: 3, role: "production" },
    { id: 8, event_id: 4, company_id: 4, role: "service" },
    { id: 9, event_id: 5, company_id: 2, role: "production" },
    { id: 10, event_id: 5, company_id: 4, role: "service" },
    { id: 11, event_id: 5, company_id: 6, role: "service" },
    { id: 12, event_id: 6, company_id: 5, role: "production" },
    { id: 13, event_id: 6, company_id: 1, role: "service" },
  ];
};
