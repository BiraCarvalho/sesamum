import { http, HttpResponse, delay } from "msw";
import { mockDashboardMetrics } from "../data/dashboard";

/**
 * Dashboard MSW Handlers
 *
 * These handlers simulate the dashboard API endpoints:
 * - GET /api/v1/dashboard/metrics/ - Returns dashboard metrics
 *
 * Note: Recent activities are stored in localStorage, not fetched from API.
 * All handlers include a realistic delay (800ms) to simulate network latency.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const dashboardHandlers = [
  // GET /api/v1/dashboard/metrics/
  http.get(`${API_BASE_URL}/api/v1/dashboard/metrics/`, async () => {
    // Simulate network delay
    await delay(800);

    return HttpResponse.json(mockDashboardMetrics, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
];
