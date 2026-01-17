import type { User } from "../../types";

/**
 * Mock Users Data
 *
 * Sample user data for MSW handlers.
 * Use `let` to allow CRUD operations to modify the array.
 */

export let mockUsers: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@sesamum.com",
    picture: "https://i.pravatar.cc/150?img=1",
    role: "admin",
    company_id: 0, // Admin doesn't belong to a specific company
  },
  {
    id: 2,
    name: "Carlos Manager",
    email: "carlos@produevents.com",
    picture: "https://i.pravatar.cc/150?img=2",
    role: "company",
    company_id: 1,
  },
  {
    id: 3,
    name: "Ana Control",
    email: "ana@produevents.com",
    picture: "https://i.pravatar.cc/150?img=3",
    role: "control",
    company_id: 1,
  },
  {
    id: 4,
    name: "Roberto Manager",
    email: "roberto@techsolutions.com",
    picture: "https://i.pravatar.cc/150?img=4",
    role: "company",
    company_id: 2,
  },
  {
    id: 5,
    name: "Juliana Control",
    email: "juliana@techsolutions.com",
    picture: "https://i.pravatar.cc/150?img=5",
    role: "control",
    company_id: 2,
  },
  {
    id: 6,
    name: "Pedro Manager",
    email: "pedro@esporteeventos.com",
    picture: "https://i.pravatar.cc/150?img=6",
    role: "company",
    company_id: 3,
  },
  {
    id: 7,
    name: "Maria Control",
    email: "maria@agroexpo.com",
    picture: "https://i.pravatar.cc/150?img=7",
    role: "control",
    company_id: 4,
  },
  {
    id: 8,
    name: "João Manager",
    email: "joao@culturalrj.com",
    picture: "https://i.pravatar.cc/150?img=8",
    role: "company",
    company_id: 5,
  },
];

/**
 * Helper function to reset mock users to initial state.
 * Useful for testing or resetting the application state.
 */
export const resetMockUsers = () => {
  mockUsers = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@sesamum.com",
      picture: "https://i.pravatar.cc/150?img=1",
      role: "admin",
      company_id: 0,
    },
    {
      id: 2,
      name: "Carlos Manager",
      email: "carlos@produevents.com",
      picture: "https://i.pravatar.cc/150?img=2",
      role: "company",
      company_id: 1,
    },
    {
      id: 3,
      name: "Ana Control",
      email: "ana@produevents.com",
      picture: "https://i.pravatar.cc/150?img=3",
      role: "control",
      company_id: 1,
    },
    {
      id: 4,
      name: "Roberto Manager",
      email: "roberto@techsolutions.com",
      picture: "https://i.pravatar.cc/150?img=4",
      role: "company",
      company_id: 2,
    },
    {
      id: 5,
      name: "Juliana Control",
      email: "juliana@techsolutions.com",
      picture: "https://i.pravatar.cc/150?img=5",
      role: "control",
      company_id: 2,
    },
    {
      id: 6,
      name: "Pedro Manager",
      email: "pedro@esporteeventos.com",
      picture: "https://i.pravatar.cc/150?img=6",
      role: "company",
      company_id: 3,
    },
    {
      id: 7,
      name: "Maria Control",
      email: "maria@agroexpo.com",
      picture: "https://i.pravatar.cc/150?img=7",
      role: "control",
      company_id: 4,
    },
    {
      id: 8,
      name: "João Manager",
      email: "joao@culturalrj.com",
      picture: "https://i.pravatar.cc/150?img=8",
      role: "company",
      company_id: 5,
    },
  ];
};
