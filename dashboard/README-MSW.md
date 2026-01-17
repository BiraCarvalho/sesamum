# MSW (Mock Service Worker) Integration Guide

## Overview

This project uses **MSW (Mock Service Worker)** to mock API responses during development. MSW intercepts network requests at the service worker level, allowing the frontend to develop independently from the backend while maintaining realistic API interactions.

## Why MSW?

- ✅ **Independent Development**: Work on the frontend without needing a running backend
- ✅ **Realistic Testing**: HTTP requests behave exactly as they would with a real API
- ✅ **Type Safety**: Full TypeScript support with typed request/response handlers
- ✅ **Easy Transition**: Simply toggle an environment variable to switch from mock to real API
- ✅ **Network Simulation**: Test loading states, errors, and edge cases with controlled delays
- ✅ **No Code Changes**: Components don't know whether they're calling MSW or a real API

---

## Architecture

### Project Structure

```
dashboard/
├── src/
│   ├── api/                      # API Layer
│   │   ├── client.ts            # Axios instance with interceptors
│   │   ├── endpoints.ts         # API endpoint constants
│   │   └── services/            # Type-safe API service modules
│   │       ├── dashboard.ts
│   │       ├── events.ts
│   │       └── index.ts
│   │
│   ├── mocks/                   # MSW Configuration
│   │   ├── browser.ts           # MSW worker setup
│   │   ├── index.ts             # Handler registry
│   │   ├── handlers/            # Request handlers by domain
│   │   │   ├── dashboard.ts
│   │   │   └── events.ts
│   │   └── data/                # Mock data separated from handlers
│   │       ├── dashboard.ts
│   │       └── events.ts
│   │
│   ├── context/                 # React Context
│   │   └── AuthContext.tsx     # JWT token management
│   │
│   └── main.tsx                 # App entry point (starts MSW)
│
├── .env.development             # Development environment config
├── .env.example                 # Template for environment variables
└── public/
    └── mockServiceWorker.js     # MSW service worker (auto-generated)
```

---

## Getting Started

### 1. Environment Configuration

MSW is controlled via environment variables in `.env.development`:

```env
# Enable/disable MSW
VITE_ENABLE_MSW=true

# API base URL
VITE_API_BASE_URL=http://localhost:8000

# Network delay simulation (ms)
VITE_MSW_DELAY=800
```

**To use MSW**: Set `VITE_ENABLE_MSW=true` (default)  
**To use real API**: Set `VITE_ENABLE_MSW=false`

### 2. Start the Development Server

```bash
npm run dev
```

When MSW is enabled, you'll see this message in the browser console:

```
🔶 MSW enabled. Using mock API responses.
[MSW] Mocking enabled.
```

### 3. Making API Calls

Components use API services from `src/api/services/`, which work transparently with or without MSW:

```typescript
import { dashboardService, eventsService } from "@/api/services";

// Fetch dashboard metrics
const fetchMetrics = async () => {
  const response = await dashboardService.getMetrics();
  return response.data;
};

// Fetch all events
const fetchEvents = async () => {
  const response = await eventsService.getAll();
  return response.data;
};

// Use with existing hooks
const { data, loading, error } = useRealTimeData(fetchMetrics, {
  interval: 600000,
});
```

**No changes needed** when switching between MSW and real API—just toggle the environment variable!

---

## MSW Handler Development

### Handler Pattern

Handlers are organized by domain in `src/mocks/handlers/`:

```typescript
// src/mocks/handlers/events.ts
import { http, HttpResponse, delay } from "msw";
import { mockEvents } from "../data/events";

export const eventHandlers = [
  // GET /api/v1/events/
  http.get("/api/v1/events/", async () => {
    await delay(1000); // Simulate network latency
    return HttpResponse.json(mockEvents);
  }),

  // POST /api/v1/events/
  http.post("/api/v1/events/", async ({ request }) => {
    const newEvent = await request.json();
    // ... validation and processing
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // DELETE /api/v1/events/:id/
  http.delete("/api/v1/events/:id/", async ({ params }) => {
    const eventId = Number(params.id);
    // ... delete logic
    return new HttpResponse(null, { status: 204 });
  }),
];
```

### Mock Data Management

Mock data is stored separately in `src/mocks/data/` for easy maintenance:

```typescript
// src/mocks/data/events.ts
import type { Event } from "../../types";

export let mockEvents: Event[] = [
  {
    id: 1,
    name: "Festival de Música 2024",
    date_begin: "2025-12-25T10:00:00Z",
    date_end: "2025-12-25T22:00:00Z",
    status: "open",
    // ... more fields
  },
  // ... more events
];
```

**Note**: Use `let` for arrays that handlers will modify (CRUD operations).

### Registering Handlers

All handlers must be registered in `src/mocks/index.ts`:

```typescript
// src/mocks/index.ts
import { dashboardHandlers } from "./handlers/dashboard";
import { eventHandlers } from "./handlers/events";

export const handlers = [
  ...dashboardHandlers,
  ...eventHandlers,
  // Add new handlers here as you implement them
];
```

---

## Migration Guide

### Migrating a Component from Inline Mocks to MSW

#### Before (Inline Mock):

```typescript
// Component with inline mock data
const MOCK_EVENTS = [{ id: 1, name: "Event" }];

const fetchEvents = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return MOCK_EVENTS;
};

const { data: events } = useRealTimeData(fetchEvents);
```

#### After (Using MSW):

**Step 1**: Move mock data to `src/mocks/data/events.ts`

```typescript
export const mockEvents = [{ id: 1, name: "Event" }];
```

**Step 2**: Create handler in `src/mocks/handlers/events.ts`

```typescript
import { http, HttpResponse, delay } from "msw";
import { mockEvents } from "../data/events";

export const eventHandlers = [
  http.get("/api/v1/events/", async () => {
    await delay(1000);
    return HttpResponse.json(mockEvents);
  }),
];
```

**Step 3**: Register handlers in `src/mocks/index.ts`

```typescript
import { eventHandlers } from "./handlers/events";

export const handlers = [...eventHandlers];
```

**Step 4**: Create API service in `src/api/services/events.ts`

```typescript
import { apiClient } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { Event } from "../../types";

export const eventsService = {
  getAll: () => apiClient.get<Event[]>(ENDPOINTS.EVENTS.LIST),
};
```

**Step 5**: Update component to use API service

```typescript
import { eventsService } from "@/api/services";

const fetchEvents = async () => {
  const response = await eventsService.getAll();
  return response.data;
};

const { data: events } = useRealTimeData(fetchEvents);
```

**Step 6**: Remove inline mock data from component ✅

---

## API Service Layer

### Creating a New Service

All API services follow this pattern:

```typescript
// src/api/services/domain.ts
import { apiClient } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { YourType } from "../../types";

export const domainService = {
  getAll: (params?: Record<string, any>) => {
    return apiClient.get<YourType[]>(ENDPOINTS.DOMAIN.LIST, { params });
  },

  getById: (id: number) => {
    return apiClient.get<YourType>(ENDPOINTS.DOMAIN.DETAIL(id));
  },

  create: (data: Omit<YourType, "id">) => {
    return apiClient.post<YourType>(ENDPOINTS.DOMAIN.CREATE, data);
  },

  update: (id: number, data: Partial<YourType>) => {
    return apiClient.put<YourType>(ENDPOINTS.DOMAIN.UPDATE(id), data);
  },

  delete: (id: number) => {
    return apiClient.delete(ENDPOINTS.DOMAIN.DELETE(id));
  },
};
```

### Adding Endpoints

Define all endpoints in `src/api/endpoints.ts`:

```typescript
export const ENDPOINTS = {
  DOMAIN: {
    LIST: "/api/v1/domain/",
    DETAIL: (id: number) => `/api/v1/domain/${id}/`,
    CREATE: "/api/v1/domain/",
    UPDATE: (id: number) => `/api/v1/domain/${id}/`,
    DELETE: (id: number) => `/api/v1/domain/${id}/`,
  },
};
```

---

## Testing Patterns

### Testing Different Scenarios

MSW makes it easy to test various API scenarios:

#### 1. Success Response

```typescript
http.get("/api/v1/events/", () => {
  return HttpResponse.json([{ id: 1, name: "Event" }]);
});
```

#### 2. Error Response (404)

```typescript
http.get("/api/v1/events/:id/", ({ params }) => {
  return HttpResponse.json({ detail: "Not found" }, { status: 404 });
});
```

#### 3. Server Error (500)

```typescript
http.get("/api/v1/events/", () => {
  return HttpResponse.json(
    { detail: "Internal server error" },
    { status: 500 }
  );
});
```

#### 4. Network Delay

```typescript
http.get("/api/v1/events/", async () => {
  await delay(3000); // 3 second delay
  return HttpResponse.json(mockEvents);
});
```

#### 5. Conditional Logic

```typescript
http.get("/api/v1/events/", ({ request }) => {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  if (status === "open") {
    return HttpResponse.json(mockEvents.filter((e) => e.status === "open"));
  }

  return HttpResponse.json(mockEvents);
});
```

---

## Current Implementation Status

### ✅ Completed Domains

#### Dashboard

- **Endpoints**:
  - `GET /api/v1/dashboard/metrics/`
  - `GET /api/v1/dashboard/activities/`
- **Service**: `dashboardService` in `src/api/services/dashboard.ts`
- **Handler**: `src/mocks/handlers/dashboard.ts`
- **Data**: `src/mocks/data/dashboard.ts`

#### Events

- **Endpoints**:
  - `GET /api/v1/events/` (with filtering by status, project_id)
  - `GET /api/v1/events/:id/`
  - `POST /api/v1/events/`
  - `PUT /api/v1/events/:id/`
  - `PATCH /api/v1/events/:id/`
  - `DELETE /api/v1/events/:id/`
- **Service**: `eventsService` in `src/api/services/events.ts`
- **Handler**: `src/mocks/handlers/events.ts`
- **Data**: `src/mocks/data/events.ts`

### 🔜 Pending Domains

The following domains need to be implemented following the same pattern:

- [ ] **Companies** - CRUD operations for companies
- [ ] **Projects** - CRUD operations for projects
- [ ] **Staffs** - CRUD operations for staff members
- [ ] **Users** - CRUD operations for users
- [ ] **Checks** - Check-in/out operations
- [ ] **Auth** - Login, logout, token refresh
- [ ] **Event Companies** - Relationship management
- [ ] **Event Staffs** - Relationship management

---

## Advanced Features

### Authentication Simulation

The `AuthContext` manages JWT tokens. To simulate login:

```typescript
// In a future auth handler
http.post("/api/v1/auth/login/", async ({ request }) => {
  const { email, password } = await request.json();

  // Mock validation
  if (email === "admin@sesamum.com" && password === "admin123") {
    return HttpResponse.json({
      access: "mock-access-token",
      refresh: "mock-refresh-token",
      user: {
        id: 1,
        name: "Admin User",
        email: "admin@sesamum.com",
        role: "admin",
      },
    });
  }

  return HttpResponse.json({ detail: "Invalid credentials" }, { status: 401 });
});
```

### State Persistence Across Requests

For CRUD operations, modify the mock data arrays:

```typescript
// POST creates new item
http.post("/api/v1/events/", async ({ request }) => {
  const newEvent = await request.json();
  const id = mockEvents.length + 1;
  const event = { id, ...newEvent };

  mockEvents.push(event); // Persists for session

  return HttpResponse.json(event, { status: 201 });
});

// DELETE removes item
http.delete("/api/v1/events/:id/", ({ params }) => {
  const index = mockEvents.findIndex((e) => e.id === Number(params.id));
  if (index !== -1) {
    mockEvents.splice(index, 1);
  }
  return new HttpResponse(null, { status: 204 });
});
```

**Note**: Changes persist only for the current browser session. Refresh the page to reset.

---

## Troubleshooting

### MSW Not Starting

**Symptom**: No MSW message in console, requests go to real API

**Solutions**:

1. Check `.env.development`: `VITE_ENABLE_MSW=true`
2. Restart dev server: `npm run dev`
3. Clear browser cache and reload
4. Check console for errors
5. Verify `public/mockServiceWorker.js` exists (run `npx msw init public/ --save` if missing)

### 404 Errors from MSW

**Symptom**: MSW is running but returns 404 for API calls

**Solutions**:

1. Verify handler is registered in `src/mocks/index.ts`
2. Check endpoint path matches exactly (including trailing `/`)
3. Look for typos in handler URL patterns
4. Check browser console for "unhandled request" warnings

### Type Errors

**Symptom**: TypeScript errors in handlers or services

**Solutions**:

1. Ensure types are defined in `src/types/index.ts`
2. Import types correctly: `import type { Event } from "../../types"`
3. Check response types match service definitions
4. Verify Axios response typing: `apiClient.get<YourType>(url)`

### CORS Errors

**Symptom**: CORS errors despite MSW being enabled

**Solutions**:
MSW runs at the service worker level, so CORS should not be an issue. If you see CORS errors:

1. Verify MSW started successfully (check console for startup message)
2. Ensure `VITE_ENABLE_MSW=true`
3. Check that requests are going to paths MSW handles
4. Try hard-refreshing the browser (Ctrl+Shift+R / Cmd+Shift+R)

---

## Best Practices

### 1. Separate Data from Handlers

✅ **Good**: Data in `src/mocks/data/`, handlers in `src/mocks/handlers/`

```typescript
// data/events.ts
export const mockEvents = [
  /* ... */
];

// handlers/events.ts
import { mockEvents } from "../data/events";
```

❌ **Bad**: Data inline in handler files

### 2. Use Realistic Delays

Simulate real network conditions to catch loading state bugs:

```typescript
await delay(800); // Typical API response time
await delay(3000); // Slow connection
```

### 3. Match Backend Response Shapes

Ensure mock responses match the expected Django/DRF response format:

```typescript
// Django typically returns detail for errors
return HttpResponse.json({ detail: "Not found" }, { status: 404 });
```

### 4. Type Everything

Use TypeScript types for all request/response data:

```typescript
const newEvent = (await request.json()) as Omit<Event, "id">;
return HttpResponse.json<Event>(createdEvent);
```

### 5. Validate Input

Add validation in handlers to catch bugs early:

```typescript
if (!newEventData.name || !newEventData.date_begin) {
  return HttpResponse.json(
    { detail: "Missing required fields" },
    { status: 400 }
  );
}
```

### 6. Document Handlers

Add JSDoc comments explaining handler behavior:

```typescript
/**
 * GET /api/v1/events/
 *
 * Supports query parameters:
 * - status: Filter by event status (open, close)
 * - project_id: Filter by project ID
 */
http.get("/api/v1/events/", async ({ request }) => {
  // ...
});
```

---

## Transitioning to Real API

When the backend is ready:

### 1. Update Environment Variable

```env
# .env.development or .env.production
VITE_ENABLE_MSW=false
```

### 2. Configure API Base URL

```env
VITE_API_BASE_URL=http://localhost:8000  # Development
# or
VITE_API_BASE_URL=https://api.sesamum.com  # Production
```

### 3. Test All Endpoints

- Verify all API endpoints exist on the backend
- Check response formats match MSW handlers
- Test error scenarios (404, 401, 500)
- Validate authentication flow

### 4. Keep MSW Handlers

Don't delete MSW setup! Keep it for:

- E2E testing
- Demo environments
- Offline development
- Onboarding new developers

---

## Future Enhancements

### Planned Features

1. **Role-Based Responses**

   - Simulate different API responses based on user role (admin, company, control)
   - Implement permission checks in handlers

2. **Pagination Support**

   - Add `?page=1&page_size=20` query parameter handling
   - Return paginated response format matching DRF

3. **Network Condition Simulator**

   - Configurable network speeds (3G, 4G, offline)
   - Random failures for resilience testing

4. **Request Logging**

   - Detailed logs of all intercepted requests
   - Performance metrics (request/response times)

5. **GraphQL Support** (if needed)
   - Add MSW GraphQL handlers
   - Type-safe GraphQL schema mocking

---

## Resources

- **MSW Documentation**: https://mswjs.io/docs/
- **Axios Documentation**: https://axios-http.com/docs/intro
- **Vite Environment Variables**: https://vitejs.dev/guide/env-and-mode.html
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## Support

If you encounter issues or have questions about MSW integration:

1. Check this README first
2. Review the existing handler implementations in `src/mocks/handlers/`
3. Check MSW documentation: https://mswjs.io/docs/
4. Look for similar patterns in completed domains (dashboard, events)

---

## Summary

MSW has been successfully integrated into the Sesamum dashboard project, providing:

✅ Complete mock API layer for dashboard and events  
✅ Type-safe API services with Axios  
✅ Easy switching between mock and real API  
✅ Foundation for testing and development  
✅ Clear migration path for remaining domains

The system is production-ready for the implemented domains and provides a solid pattern for implementing the remaining features.
