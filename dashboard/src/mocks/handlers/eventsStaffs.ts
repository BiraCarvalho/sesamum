import { http, HttpResponse, delay } from "msw";
import { mockEventsStaffs } from "../data/eventsStaffs";
import { mockEvents } from "../data/events";
import { mockStaffs } from "../data/staffs";
import type { EventStaff } from "../../types";

/**
 * EventStaffs MSW Handlers
 *
 * These handlers simulate the event_staff relationship API endpoints:
 * - GET    /api/v1/event-staff/       - List events for a staff or staff for an event
 * - GET    /api/v1/event-staff/:id/   - Get single event_staff relationship by ID
 * - POST   /api/v1/event-staff/       - Create new event_staff relationship
 * - DELETE /api/v1/event-staff/:id/   - Delete event_staff relationship
 *
 * All handlers include realistic delays to simulate network latency.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const eventStaffsHandlers = [
  // GET /api/v1/event-staff/ - List event-staff relationships
  // Supports filtering by staff_cpf or event_id
  // When staff_cpf is provided, returns full Event objects
  // When event_id is provided, returns full Staff objects
  http.get(`${API_BASE_URL}/api/v1/event-staff/`, async ({ request }) => {
    await delay(600);

    const url = new URL(request.url);
    const staffCpfParam = url.searchParams.get("staff_cpf");
    const eventIdParam = url.searchParams.get("event_id");

    let filtered = [...mockEventsStaffs];

    // Filter by staff_cpf - return events for this staff member
    if (staffCpfParam) {
      const staffEventRelations = filtered.filter(
        (es) => es.staff_cpf === staffCpfParam
      );

      // Get the actual events for this staff member
      const eventIds = staffEventRelations.map((es) => es.event_id);
      const staffEvents = mockEvents.filter((e) => eventIds.includes(e.id));

      return HttpResponse.json(staffEvents, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Filter by event_id - return staff members for this event
    if (eventIdParam) {
      const eventId = Number(eventIdParam);
      const eventStaffRelations = filtered.filter(
        (es) => es.event_id === eventId
      );

      // Get the actual staffs for this event
      const staffCpfs = eventStaffRelations.map((es) => es.staff_cpf);
      const eventStaffs = mockStaffs.filter((s) => staffCpfs.includes(s.cpf));

      return HttpResponse.json(eventStaffs, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return HttpResponse.json(filtered, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  // GET /api/v1/event-staff/:id/ - Get single event_staff relationship
  http.get(`${API_BASE_URL}/api/v1/event-staff/:id/`, async ({ params }) => {
    await delay(400);

    const relationId = Number(params.id);
    const relation = mockEventsStaffs.find((es) => es.id === relationId);

    if (!relation) {
      return HttpResponse.json(
        { detail: "Event-Staff relationship not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(relation, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  // POST /api/v1/event-staff/ - Create new event_staff relationship
  http.post(`${API_BASE_URL}/api/v1/event-staff/`, async ({ request }) => {
    await delay(800);

    const newRelationData = (await request.json()) as Omit<EventStaff, "id">;

    // Validation
    if (!newRelationData.staff_cpf || !newRelationData.event_id) {
      return HttpResponse.json(
        { detail: "staff_cpf and event_id are required" },
        { status: 400 }
      );
    }

    // Check if relationship already exists
    const exists = mockEventsStaffs.some(
      (es) =>
        es.staff_cpf === newRelationData.staff_cpf &&
        es.event_id === newRelationData.event_id
    );

    if (exists) {
      return HttpResponse.json(
        { detail: "Staff is already assigned to this event" },
        { status: 400 }
      );
    }

    // Create new relationship
    const newRelation: EventStaff = {
      id: Math.max(...mockEventsStaffs.map((es) => es.id), 0) + 1,
      ...newRelationData,
    };

    mockEventsStaffs.push(newRelation);

    return HttpResponse.json(newRelation, {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  // DELETE /api/v1/event-staff/:id/ - Delete event_staff relationship
  http.delete(`${API_BASE_URL}/api/v1/event-staff/:id/`, async ({ params }) => {
    await delay(600);

    const relationId = Number(params.id);
    const index = mockEventsStaffs.findIndex((es) => es.id === relationId);

    if (index === -1) {
      return HttpResponse.json(
        { detail: "Event-Staff relationship not found" },
        { status: 404 }
      );
    }

    mockEventsStaffs.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
