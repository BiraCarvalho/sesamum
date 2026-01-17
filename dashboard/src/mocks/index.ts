import { dashboardHandlers } from "./handlers/dashboard";
import { eventHandlers } from "./handlers/events";

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
 * - companyHandlers (CRUD operations)
 * - projectHandlers (CRUD operations)
 * - staffHandlers (CRUD operations)
 * - userHandlers (CRUD operations)
 * - checkHandlers (check-in/out operations)
 */

export const handlers = [...dashboardHandlers, ...eventHandlers];
