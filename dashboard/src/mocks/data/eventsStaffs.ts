import type { EventStaff } from "../../types";

/**
 * Mock EventsStaffs Data
 * Represents the events_staff relationship table
 * Links staff members (by CPF) to events they are assigned to
 */
export let mockEventsStaffs: EventStaff[] = [
  // Event 1 - Festival de Música 2024
  { id: 1, event_id: 1, staff_cpf: "123.456.789-00" }, // João Silva
  { id: 2, event_id: 1, staff_cpf: "234.567.890-11" }, // Maria Santos
  { id: 3, event_id: 1, staff_cpf: "345.678.901-22" }, // Pedro Oliveira

  // Event 2 - Conferência Tech Brasil
  { id: 4, event_id: 2, staff_cpf: "345.678.901-22" }, // Pedro Oliveira
  { id: 5, event_id: 2, staff_cpf: "456.789.012-33" }, // Ana Costa
  { id: 6, event_id: 2, staff_cpf: "567.890.123-44" }, // Carlos Ferreira

  // Event 3 - Workshop de Design
  { id: 7, event_id: 3, staff_cpf: "123.456.789-00" }, // João Silva
  { id: 8, event_id: 3, staff_cpf: "678.901.234-55" }, // Juliana Lima

  // Event 4 - Evento Corporativo - Ano Novo
  { id: 9, event_id: 4, staff_cpf: "567.890.123-44" }, // Carlos Ferreira
  { id: 10, event_id: 4, staff_cpf: "678.901.234-55" }, // Juliana Lima
  { id: 11, event_id: 4, staff_cpf: "789.012.345-66" }, // Roberto Alves

  // Event 5 - Feira de Negócios
  { id: 12, event_id: 5, staff_cpf: "456.789.012-33" }, // Ana Costa
  { id: 13, event_id: 5, staff_cpf: "789.012.345-66" }, // Roberto Alves
  { id: 14, event_id: 5, staff_cpf: "890.123.456-77" }, // Fernanda Souza

  // Event 6 - Show Beneficente (closed)
  { id: 15, event_id: 6, staff_cpf: "123.456.789-00" }, // João Silva
  { id: 16, event_id: 6, staff_cpf: "234.567.890-11" }, // Maria Santos
  { id: 17, event_id: 6, staff_cpf: "890.123.456-77" }, // Fernanda Souza
];

/**
 * Helper function to reset mock events_staff to initial state.
 */
export const resetMockEventsStaffs = () => {
  mockEventsStaffs = [
    { id: 1, event_id: 1, staff_cpf: "123.456.789-00" },
    { id: 2, event_id: 1, staff_cpf: "234.567.890-11" },
    { id: 3, event_id: 1, staff_cpf: "345.678.901-22" },
    { id: 4, event_id: 2, staff_cpf: "345.678.901-22" },
    { id: 5, event_id: 2, staff_cpf: "456.789.012-33" },
    { id: 6, event_id: 2, staff_cpf: "567.890.123-44" },
    { id: 7, event_id: 3, staff_cpf: "123.456.789-00" },
    { id: 8, event_id: 3, staff_cpf: "678.901.234-55" },
    { id: 9, event_id: 4, staff_cpf: "567.890.123-44" },
    { id: 10, event_id: 4, staff_cpf: "678.901.234-55" },
    { id: 11, event_id: 4, staff_cpf: "789.012.345-66" },
    { id: 12, event_id: 5, staff_cpf: "456.789.012-33" },
    { id: 13, event_id: 5, staff_cpf: "789.012.345-66" },
    { id: 14, event_id: 5, staff_cpf: "890.123.456-77" },
    { id: 15, event_id: 6, staff_cpf: "123.456.789-00" },
    { id: 16, event_id: 6, staff_cpf: "234.567.890-11" },
    { id: 17, event_id: 6, staff_cpf: "890.123.456-77" },
  ];
};
