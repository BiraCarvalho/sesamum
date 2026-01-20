import { dashboardHandlers } from "./handlers/dashboard";
import { eventHandlers } from "./handlers/events";
import { companyHandlers } from "./handlers/companies";
import { projectHandlers } from "./handlers/projects";
import { staffHandlers } from "./handlers/staffs";
import { userHandlers } from "./handlers/users";
import { eventUsersHandlers } from "./handlers/eventsUsers";
import { eventStaffsHandlers } from "./handlers/eventsStaffs";
import { eventCompaniesHandlers } from "./handlers/eventsCompanies";
import { authHandlers } from "./handlers/auth";
import { checkHandlers } from "./handlers/checks";
import { userInvitesHandlers } from "./handlers/userInvites";

/**
 * MSW Handlers Index
 *
 * This file exports all MSW request handlers for the application.
 * Handlers are organized by domain (dashboard, events, etc.).
 *
 * ✅ All handlers now implemented and API-compliant:
 * - Auth: Google OAuth login/register with real JWT
 * - Checks: Registration, check-in, check-out with validation
 * - User Invites: Slot-based registration system
 */

export const handlers = [
  ...authHandlers,
  ...checkHandlers,
  ...userInvitesHandlers,
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
