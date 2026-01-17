import type { Company } from "../../types";

/**
 * Mock Companies Data
 *
 * Sample company data for MSW handlers.
 * Use `let` to allow CRUD operations to modify the array.
 */

export let mockCompanies: Company[] = [
  {
    id: 1,
    name: "ProduEvents Ltda",
    type: "production",
    cnpj: "12.345.678/0001-90",
  },
  {
    id: 2,
    name: "Tech Solutions SP",
    type: "service",
    cnpj: "23.456.789/0001-01",
  },
  {
    id: 3,
    name: "Esportes & Eventos",
    type: "production",
    cnpj: "34.567.890/0001-12",
  },
  {
    id: 4,
    name: "Agro Expo Brasil",
    type: "service",
    cnpj: "45.678.901/0001-23",
  },
  {
    id: 5,
    name: "Cultural Events RJ",
    type: "production",
    cnpj: "56.789.012/0001-34",
  },
  {
    id: 6,
    name: "Audio & Light Services",
    type: "service",
    cnpj: "67.890.123/0001-45",
  },
];

/**
 * Helper function to reset mock companies to initial state.
 * Useful for testing or resetting the application state.
 */
export const resetMockCompanies = () => {
  mockCompanies = [
    {
      id: 1,
      name: "ProduEvents Ltda",
      type: "production",
      cnpj: "12.345.678/0001-90",
    },
    {
      id: 2,
      name: "Tech Solutions SP",
      type: "service",
      cnpj: "23.456.789/0001-01",
    },
    {
      id: 3,
      name: "Esportes & Eventos",
      type: "production",
      cnpj: "34.567.890/0001-12",
    },
    {
      id: 4,
      name: "Agro Expo Brasil",
      type: "service",
      cnpj: "45.678.901/0001-23",
    },
    {
      id: 5,
      name: "Cultural Events RJ",
      type: "production",
      cnpj: "56.789.012/0001-34",
    },
    {
      id: 6,
      name: "Audio & Light Services",
      type: "service",
      cnpj: "67.890.123/0001-45",
    },
  ];
};
