import { dashboardHandlers } from "./handlers/dashboard";
import { eventHandlers } from "./handlers/events";
import { companyHandlers } from "./handlers/companies";
import { projectHandlers } from "./handlers/projects";
import { staffHandlers } from "./handlers/staffs";
import { userHandlers } from "./handlers/users";
import { eventUsersHandlers } from "./handlers/eventsUsers";
import { eventStaffsHandlers } from "./handlers/eventsStaffs";
import { eventCompaniesHandlers } from "./handlers/eventsCompanies";

/**
 * MSW Handlers Index
 *
 * This file exports all MSW request handlers for the application.
 * Handlers are organized by domain (dashboard, events, etc.).
 *
 * As new domains are implemented, import and add their handlers here.
 *
 * Future handlers to add:
 * - authHandlers (login, refresh, logout)
 * - checkHandlers (check-in/out operations)
 */

export const handlers = [
  ...dashboardHandlers,
  ...eventHandlers,
  ...companyHandlers,
  ...projectHandlers,
  ...staffHandlers,
  ...userHandlers,
  ...eventUsersHandlers,
  ...eventStaffsHandlers,
  ...eventCompaniesHandlers,
];
