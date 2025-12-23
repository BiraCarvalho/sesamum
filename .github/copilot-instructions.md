# Sesamum Project - AI Assistant Instructions

## 1. Project Context

**Sesamum** is an event staff credentialing platform.

- **Goal:** Manage projects, events, companies, and staff check-in/out.
- **Core Workflow:** Admin creates Event → Assigns Companies → Companies assign Staff → Control performs Check-in/out.
- **Roles:**
  - `Admin`: Full system access.
  - `Company`: Manage own staff and view assigned events.
  - `Control`: Operational role (check-in/out only).

## 2. Tech Stack & Environment

### Backend

- **Framework:** Django 6.0 + DRF 3.14.
- **Auth:** `djangorestframework-simplejwt` (JWT).
- **DB:** MySQL 8.0 (`mysqlclient`).
- **Tools:** `python-decouple`, `django-cors-headers`.

### Frontend

- **Core:** React 19, TypeScript 5.9, Vite 7.
- **Styling:** Tailwind CSS v4 (Layout) + **CSS Variables** (Visuals).
- **Components:** Headless UI via **Radix UI** primitives.
- **State/Routing:** Context API, React Router v7, Axios.

---

## 3. Data Schema (MySQL)

### Core Entities

| Model       | Fields                                                  | Constraints    | Notes                                                                  |
| :---------- | :------------------------------------------------------ | :------------- | :--------------------------------------------------------------------- |
| **Company** | `id`, `name`, `cnpj`                                    | `cnpj` UNIQUE  |                                                                        |
| **User**    | `id`, `name`, `email`, `password`, `role`, `company_id` | `email` UNIQUE | Roles: `admin`, `company`, `control`. `company_id` nullable for admin. |
| **Staff**   | `id`, `name`, `cpf`, `company_id`                       | `cpf` UNIQUE   | FK -> Company                                                          |

### Project Management

| Model       | Fields                                                         | Constraints | Notes                                                  |
| :---------- | :------------------------------------------------------------- | :---------- | :----------------------------------------------------- |
| **Project** | `id`, `name`, `status`, `company_id`                           |             | Status: `aberto`, `finalizado`. FK -> Company (owner). |
| **Event**   | `id`, `name`, `date_begin`, `date_end`, `status`, `project_id` |             | Status: `open`, `close`. FK -> Project.                |

### Relationships

| Model            | Fields                                 | Notes                                                      |
| :--------------- | :------------------------------------- | :--------------------------------------------------------- |
| **EventCompany** | `id`, `role`, `event_id`, `company_id` | Roles: `production` (manages), `service` (supplies staff). |
| **EventUser**    | `id`, `user_id`, `event_id`            | Future use / Specific access.                              |
| **EventStaff**   | `id`, `event_id`, `staff_id`           | The specific assignment of a person to an event.           |

### Operational

| Model     | Fields                                                           | Notes                                                |
| :-------- | :--------------------------------------------------------------- | :--------------------------------------------------- |
| **Check** | `id`, `action`, `timestamp`, `event_staff_id`, `user_control_id` | Action: `check-in`, `check-out`. Timestamp auto-now. |

---

## 4. Backend Implementation Guidelines (`backend/`)

### Configuration

- **Settings:** `AUTH_USER_MODEL` (Custom), `CORS_ALLOWED_ORIGINS` (from .env).
- **JWT:** Access (15m), Refresh (7d).
- **Permissions:**
  - `IsAdmin`: `user.role == 'admin'`
  - `IsCompany`: `user.role == 'company'`
  - `IsControl`: `user.role == 'control'`

### API Architecture (`v1/`)

- **Serializers:** Create `Full` variants for details and `Minimal` variants (id, name only) for restricted visibility (e.g., Production viewing Service staff).
- **ViewSets:**
  - **Admin:** Full CRUD on all endpoints.
  - **Company:** Read-only on Events (filtered by assignment). CRUD on own Staff.
  - **Control:** Read-only Events. Write permissions on `CheckViewSet`.
- **Logic:**
  - `StaffMinimalSerializer` must be used when a `production` company views staff from a `service` company.

---

## 5. Frontend Implementation Guidelines (`dashboard/`)

### Folder Structure

```text
src/
├── api/             # Axios instances & endpoints (auth, events, checks...)
├── components/
│   ├── layout/      # Sidebar, Header, ProtectedRoute
│   └── shared/      # StatCard, Toast, Radix primitives
├── context/         # AuthContext (User state & Logic)
├── hooks/           # useAuth, useApi, useLocalStorage
├── pages/           # Views (Login, Dashboard, CheckIn...)
├── types/           # TypeScript interfaces (match DB schema)
└── index.css        # Tailwind @imports & :root Variables
```
