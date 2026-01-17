import type { Staff } from "../../types";

/**
 * Mock Staffs Data
 *
 * Sample staff data for MSW handlers.
 * Use `let` to allow CRUD operations to modify the array.
 */

export let mockStaffs: Staff[] = [
  {
    id: 1,
    name: "João Silva",
    cpf: "123.456.789-00",
    email: "joao.silva@email.com",
    company_id: 1,
    created_at: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Maria Santos",
    cpf: "234.567.890-11",
    email: "maria.santos@email.com",
    company_id: 1,
    created_at: "2025-01-20T14:20:00Z",
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    cpf: "345.678.901-22",
    email: "pedro.oliveira@email.com",
    company_id: 2,
    created_at: "2025-02-01T09:15:00Z",
  },
  {
    id: 4,
    name: "Ana Costa",
    cpf: "456.789.012-33",
    email: "ana.costa@email.com",
    company_id: 2,
    created_at: "2025-02-05T11:45:00Z",
  },
  {
    id: 5,
    name: "Carlos Ferreira",
    cpf: "567.890.123-44",
    email: "carlos.ferreira@email.com",
    company_id: 3,
    created_at: "2025-02-10T16:00:00Z",
  },
  {
    id: 6,
    name: "Juliana Lima",
    cpf: "678.901.234-55",
    email: "juliana.lima@email.com",
    company_id: 3,
    created_at: "2025-02-15T08:30:00Z",
  },
  {
    id: 7,
    name: "Roberto Alves",
    cpf: "789.012.345-66",
    email: "roberto.alves@email.com",
    company_id: 4,
    created_at: "2025-03-01T13:10:00Z",
  },
  {
    id: 8,
    name: "Fernanda Souza",
    cpf: "890.123.456-77",
    email: "fernanda.souza@email.com",
    company_id: 5,
    created_at: "2025-03-05T10:50:00Z",
  },
];

/**
 * Helper function to reset mock staffs to initial state.
 * Useful for testing or resetting the application state.
 */
export const resetMockStaffs = () => {
  mockStaffs = [
    {
      id: 1,
      name: "João Silva",
      cpf: "123.456.789-00",
      email: "joao.silva@email.com",
      company_id: 1,
      created_at: "2025-01-15T10:30:00Z",
    },
    {
      id: 2,
      name: "Maria Santos",
      cpf: "234.567.890-11",
      email: "maria.santos@email.com",
      company_id: 1,
      created_at: "2025-01-20T14:20:00Z",
    },
    {
      id: 3,
      name: "Pedro Oliveira",
      cpf: "345.678.901-22",
      email: "pedro.oliveira@email.com",
      company_id: 2,
      created_at: "2025-02-01T09:15:00Z",
    },
    {
      id: 4,
      name: "Ana Costa",
      cpf: "456.789.012-33",
      email: "ana.costa@email.com",
      company_id: 2,
      created_at: "2025-02-05T11:45:00Z",
    },
    {
      id: 5,
      name: "Carlos Ferreira",
      cpf: "567.890.123-44",
      email: "carlos.ferreira@email.com",
      company_id: 3,
      created_at: "2025-02-10T16:00:00Z",
    },
    {
      id: 6,
      name: "Juliana Lima",
      cpf: "678.901.234-55",
      email: "juliana.lima@email.com",
      company_id: 3,
      created_at: "2025-02-15T08:30:00Z",
    },
    {
      id: 7,
      name: "Roberto Alves",
      cpf: "789.012.345-66",
      email: "roberto.alves@email.com",
      company_id: 4,
      created_at: "2025-03-01T13:10:00Z",
    },
    {
      id: 8,
      name: "Fernanda Souza",
      cpf: "890.123.456-77",
      email: "fernanda.souza@email.com",
      company_id: 5,
      created_at: "2025-03-05T10:50:00Z",
    },
  ];
};
