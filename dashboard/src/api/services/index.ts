/**
 * API Services Index
 *
 * Central export point for all API services.
 * Import services from here to maintain consistency.
 *
 * Usage:
 *   import { dashboardService, eventsService } from '@/api/services';
 */

export { dashboardService } from "./dashboard";
export { eventsService } from "./events";
export { companiesService } from "./companies";
export { projectsService } from "./projects";
export { staffsService } from "./staffs";
export { usersService } from "./users";
export { eventCompaniesService } from "./eventCompanies";
export { eventStaffService } from "./eventStaff";

// Future exports to add as domains are implemented:
// export { authService } from './auth';
// export { companiesService } from './companies';
// export { projectsService } from './projects';
// export { staffsService } from './staffs';
// export { usersService } from './users';
// export { checksService } from './checks';
