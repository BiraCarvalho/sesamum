# Sesamum Project – AI Agent Coding Guide

## Overview

Sesamum is an event staff credentialing platform with a Django 6/DRF backend and a React 19/TypeScript dashboard. The system manages projects, events, companies, and staff check-in/out, with strict role-based access and clear separation of admin, company, and control workflows.

## Architecture & Data Flow

- **Backend (`backend/`)**: Django 6.0 + DRF 3.14, MySQL 8.0, JWT auth (simplejwt). All business logic and permissions are enforced server-side. Key models: Company, User, Staff, Project, Event, EventCompany, EventStaff, Check.

  - **API versioning**: All endpoints are under `api/v1/`.
  - **Permissions**: Custom roles (`admin`, `company`, `control`) enforced via DRF permissions. See `v1/views.py` for role logic.
  - **Serializers**: Use `Full` and `Minimal` variants. When exposing staff to a production company, always use `StaffMinimalSerializer`.
  - **Settings**: JWT access (15m), refresh (7d). CORS origins from `.env`.

- **Frontend (`dashboard/`)**: React 19, Vite 7, TypeScript 5.9, Tailwind CSS v4, Radix UI. State via Context API, routing with React Router v7, API via Axios.
  - **Folder structure**: See `src/` for `api/`, `components/`, `context/`, `hooks/`, `pages/`, `types/`.
  - **Styling**: Layout with Tailwind, visuals tailwind tokens in `theme.css`.
  - **Component conventions**: Shared UI in `components/shared/`, layout in `components/layout/`.
  - **Types**: All API data shapes in `types/index.ts` (match backend schema).

## Developer Workflows

- **Backend**:

  - Run: `python manage.py runserver` (from `backend/`)
  - Migrate: `python manage.py makemigrations && python manage.py migrate`
  - Test: `python manage.py test`
  - Environment: Use `.env` for DB and CORS config

- **Frontend**:
  - Dev: `npm run dev` (from `dashboard/`)
  - Build: `npm run build`
  - Lint: `npm run lint`
  - Type-check: `npm run type-check`

## Project-Specific Patterns & Conventions

- **Backend**:

  - All API endpoints are versioned under `/api/v1/`.
  - Use `Minimal` serializers for cross-company data exposure (see `v1/serializers.py`).
  - Permissions are role-based and enforced in `v1/views.py`.
  - Only `admin` can CRUD all; `company` can CRUD own staff; `control` can only check-in/out.

- **Frontend**:
  - API calls are abstracted in `src/api/`.
  - Auth state and logic in `src/context/AuthContext.tsx`.
  - Use Radix UI primitives for all interactive components.
  - All types/interfaces must be defined in `src/types/index.ts` and kept in sync with backend models.
  - Use Context API for global state, avoid Redux.

### Forms Pattern

Forms in the Sesamum dashboard follow a consistent pattern for validation, submission, and user feedback:

#### Form Structure

1. **Schema Definition** (`src/schemas/`):

   - Create a dedicated schema file using Zod for validation (e.g., `projectSchema.ts`)
   - Export both the schema and the inferred TypeScript type
   - Use utilities from `src/lib/dateUtils.ts` for date validation
   - Create utilities in `src/lib/` for common form tasks (e.g., formatting dates)
   - Example:

     ```typescript
     import { z } from "zod";
     import { isValidDate } from "../lib/dateUtils";

     export const projectSchema = z.object({
       name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
       description: z.string().optional(),
       // ... other fields
     });

     export type ProjectFormData = z.infer<typeof projectSchema>;
     ```

2. **Form Component** (`src/components/forms/`):

   - Use `react-hook-form` with Zod resolver for validation
   - Import schema from `src/schemas/`
   - Use `IMaskInput` from `react-imask` for masked inputs (dates, CPF, CNPJ)
   - Date format: Always use DD/MM/YYYY for user input, convert to ISO (YYYY-MM-DD) for API
   - Props interface: `{ mode: "create" | "edit", data?: T, onSuccess: () => void, onCancel: () => void }`
   - Handle loading states, errors, and submission feedback
   - Example structure:

     ```typescript
     import { useForm, Controller } from "react-hook-form";
     import { zodResolver } from "@hookform/resolvers/zod";
     import { IMaskInput } from "react-imask";
     import {
       projectSchema,
       type ProjectFormData,
     } from "../../schemas/projectSchema";

     export function ProjectForm({ mode, project, onSuccess, onCancel }) {
       const {
         register,
         handleSubmit,
         formState: { errors },
         control,
       } = useForm<ProjectFormData>({
         resolver: zodResolver(projectSchema),
         defaultValues: {
           /* ... */
         },
       });
       // ... implementation
     }
     ```

3. **Date Handling**:

   - User input/display: `DD/MM/YYYY` format
   - API payload: `YYYY-MM-DD` format (ISO)
   - Use utilities from `src/lib/dateUtils.ts`:
     - `formatDateToDDMMYYYY(isoDate)` - Convert ISO to display format
     - `formatDateToISO(dateStr)` - Convert DD/MM/YYYY to ISO
     - `isValidDate(dateStr)` - Validate DD/MM/YYYY format

4. **Input Masking**:

   - Use `IMaskInput` component with `Controller` from react-hook-form
   - Date mask: `"00/00/0000"`
   - CPF mask: `"000.000.000-00"`
   - CNPJ mask: `"00.000.000/0000-00"`
   - Example:
     ```tsx
     <Controller
       name="date_begin"
       control={control}
       render={({ field }) => (
         <IMaskInput
           mask="00/00/0000"
           value={field.value}
           onAccept={(value: string) => field.onChange(value)}
           // ... other props
         />
       )}
     />
     ```

5. **Conditional Fields**:

   - Use mode prop to conditionally render fields
   - Example: Status selector only in edit mode, always "open" on create
   - Pattern: `{mode === "edit" && <StatusField />}`

6. **Error Handling**:

   - Display field-level validation errors below inputs
   - Show API errors in a banner at the top of the form
   - Keep form open on error, reset and close on success

7. **Styling**:
   - Use Tailwind CSS classes with design tokens from `theme.css`
   - Input classes: `w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-input-bg border border-input-border text-input-text`
   - Button classes: Primary actions use `bg-primary hover:bg-primary-hover`, secondary use `bg-gray-100 hover:bg-gray-200`
   - Error text: `text-xs text-red-600`

## Integration & Cross-Component Communication

- **Auth**: JWT tokens managed in frontend context, sent via Axios headers.
- **Event/Staff Assignment**: EventCompany and EventStaff models mediate company/event/staff relationships. See backend `v1/models.py` and frontend `src/types/index.ts`.
- **Check-in/out**: Only `control` users can POST to `CheckViewSet`.

## References

- Backend: `backend/v1/models.py`, `backend/v1/views.py`, `backend/v1/serializers.py`
- Frontend: `dashboard/src/api/`, `dashboard/src/types/index.ts`, `dashboard/src/context/AuthContext.tsx`

---

**For AI agents:**

- Always respect role-based access and serializer conventions.
- When in doubt, check referenced files for patterns.
- Keep backend and frontend types in sync.
- Use project scripts for builds/tests; do not assume defaults.

## Schema de Banco de Dados Simplificado

### 1. Entidades Principais

#### `company`

- **id** (PK)
- **name**
- **cnpj** (Unique)

#### `users`

- **id** (PK)
- **name**
- **email**
- **role** (`admin`, `company`, `control`)
- **company_id** (FK -> `company.id`)
- **created_at** (DateTime - data de credenciamento)

#### `staffs`

- **id** (PK)
- **name**
- **cpf** (Unique)
- **email**
- **company_id** (FK -> `company.id`)
- **created_at** (DateTime - data de credenciamento)

---

### 2. Gestão de Projetos e Eventos

#### `projects`

- **id** (PK)
- **name**
- **status** (`aberto`, `finalizado`)
- **company_id** (FK -> `company.id`)

#### `events`

- **id** (PK)
- **name**
- **date_begin** / **date_end**
- **status** (`open`, `close`)
- **project_id** (FK -> `projects.id`)

---

### 3. Tabelas de Ligação (Relacionamentos)

#### `events_company`

- **id** (PK)
- **role** (`production`, `service`)
- **event_id** (FK -> `events.id`)
- **company_id** (FK -> `company.id`)

#### `events_user`

- **id** (PK)
- **user_id** (FK -> `users.id`)
- **event_id** (FK -> `events.id`)

#### `events_staff`

- **id** (PK)
- **event_id** (FK -> `events.id`)
- **staff_cpf** (FK -> `staffs.cpf`)

---

### 4. Operacional

#### `checks`

- **id** (PK)
- **action** (`check-in`, `check-out`)
- **timestamp**
- **events_staff_id** (FK -> `events_staff.id`)
- **user_control_id** (FK -> `users.id`)
