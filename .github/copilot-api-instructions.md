# 🤖 Copilot API Instructions - Sesamum Backend

Este documento serve como a "Fonte da Verdade" para o desenvolvimento da API Django. Siga rigorosamente os nomes de campos, regras de permissão e estrutura.

## 🛠️ Stack Tecnológico

- **Linguagem:** Python 3.x
- **Framework:** Django 6.0 + Django REST Framework 3.14
- **Auth:** JWT (SimpleJWT)
- **DB:** MySQL 8.0
- **Libs Específicas:** `django-filter`, `nanoid`, `google-auth` (para validação de tokens OAuth2).
- **Padrão de URL:** `/api/v1/`

---

## 🗄️ Schema do Banco de Dados (Definitivo)

### Regras Gerais de Campos

- **Status Enum:** Todos os campos de status devem aceitar: `('open', 'close', 'pending')`.
- **Status Default:** O valor padrão para novos registros de status deve ser `'pending'`.
- **Auditoria:** Todas as tabelas que possuem `created_at` devem possuir `created_by` (FK -> `users`).
- **Formatação de Documentos:**
  - **CNPJ:** Armazenar apenas números (String, 14 caracteres).
  - **CPF:** Armazenar apenas números (String, 11 caracteres).
  - _O Backend deve sanitizar a entrada removendo pontos e traços antes de salvar._

### Entidades Principais

#### `company`

- **id** (PK): Auto-increment integer
- **name**: String (max_length=255)
- **cnpj**: String (max_length=14, unique) - Apenas dígitos.
- **created_at**: DateTime (auto_now_add)
- **created_by**: FK -> `users` (nullable apenas se for criação via seed/system)

#### `users`

- **id** (PK): Auto-increment integer
- **name**: String (max_length=255)
- **email**: EmailField (unique)
- **role**: String/Enum (`admin`, `company`, `control`)
- **company_id** (FK -> `company`, null=True se role=admin)
- **created_at**: DateTime
- **created_by**: FK -> `users` (self-referencing or admin)
- _Nota: Não existe campo password. A autenticação é 100% via Google._

#### `user_invites` (Slots de Cadastro)

Representa um "Slot" aberto pelo Admin para uma empresa receber um novo usuário.

- **id** (PK): UUID ou NanoID (Usado como token na URL de convite).
- **company_id** (FK -> `company`): A empresa para a qual o usuário será vinculado.
- **email**: EmailField (Opcional - se preenchido, restringe o slot a este email específico).
- **role**: String/Enum (`company`, `control`) - A role que o novo usuário terá.
- **used_by**: FK -> `users` (Nullable) - Referência ao usuário criado através deste convite. Null = convite não utilizado.
- **created_at**: DateTime
- **expires_at**: DateTime (Obrigatório).
- **created_by**: FK -> `users` (Admin).

_Nota: O campo `status` é computado dinamicamente pelo servidor:_

- _`pending`: `used_by` é null E `expires_at` > data atual_
- _`used`: `used_by` não é null_
- _`expired`: `used_by` é null E `expires_at` <= data atual_

#### `staffs`

- **id** (PK): Auto-increment integer
- **name**: String (max_length=255)
- **cpf**: String (max_length=11) - Apenas dígitos.
- **company_id** (FK -> `company`): A empresa "dona" deste staff.
- **created_at**: DateTime
- **created_by**: FK -> `users`
  - _Constraint:_ `UniqueTogether(['company_id', 'cpf'])` (Evita duplicidade do mesmo funcionário dentro da mesma empresa).

### Gerenciamento de Projetos e Eventos

#### `projects`

- **id** (PK): Auto-increment integer
- **name**: String (max_length=255)
- **description**: TextField (optional/blank)
- **date_begin**: Date (optional/blank)
- **date_end**: Date (optional/blank)
- **status**: Enum (`open`, `close`, `pending`) - Default: `pending`
- **company_id** (FK -> `company`): A empresa criadora/dona do projeto.
- **created_at**: DateTime
- **created_by**: FK -> `users`

#### `events`

- **id** (PK): Auto-increment integer
- **name**: String (max_length=255)
- **description**: TextField (optional/blank)
- **location**: String (max_length=255, optional/blank)
- **date_begin**: DateTime
- **date_end**: DateTime
- **status**: Enum (`open`, `close`, `pending`) - Default: `pending`
- **project_id** (FK -> `projects`)
- **created_at**: DateTime
- **created_by**: FK -> `users`

### Tabelas de Relacionamento e Operação

#### `events_company`

Define quais empresas participam de um evento e qual seu papel.

- **id** (PK)
- **event_id** (FK -> `events`)
- **company_id** (FK -> `company`)
- **role**: String/Enum (`production`, `service`)
  - _Regra:_ Uma empresa pode ser `production` em um evento e `service` em outro.
  - _Constraint:_ Unique together (`event_id`, `company_id`)

#### `events_staff`

Credenciamento e Vínculo: Define que um Staff está autorizado a entrar neste evento.

- **id** (PK): **Nano UUID** (String única gerada, ex: `V1StGXR8_Z5jdHi6B-myT`).
- **event_id** (FK -> `events`)
- **staff_id** (FK -> `staffs`)
- **staff_cpf**: String (max_length=11) - Redundância controlada.
- **registration_check_id**: FK -> `checks` (Nullable).
  - _Descrição:_ Campo de controle de credenciamento. Inicia vazio (`null`).
  - _Regra:_ Quando um `check` do tipo `registration` é criado, seu ID é salvo aqui.
- **created_at**: DateTime
- **created_by**: FK -> `users`
  - _Constraint:_ `UniqueTogether(['event_id', 'staff_cpf'])`

#### `checks`

Histórico de credenciamento e fluxo de entrada/saída.

- **id** (PK)
- **action**: String/Enum (`registration`, `check-in`, `check-out`)
- **timestamp**: DateTime (auto_now_add)
- **events_staff_id** (FK -> `events_staff`)
- **user_control_id** (FK -> `users`): Usuário com role `control` que realizou a ação.

---

## 🔒 Regras de Negócio e Permissões (DRF)

### 1. Autenticação & Cadastro (Google Auth)

#### Login (`/api/v1/auth/google/login/`)

- Verifica se email existe em `users`. Se sim, retorna JWT. Se não, 403.

#### Cadastro via Slot (`/api/v1/auth/google/register/`)

- **Fluxo de Validação de Slot:**
  1. Buscar `invite_token` na tabela `user_invites`.
  2. Verificar Status: Deve ser `pending`.
  3. **Verificar Expiração:** Se `now() > invite.expires_at`, retornar erro 400 "Convite Expirado" e atualizar status para `expired`.
  4. Prosseguir com criação do usuário e consumo do slot (`used`).

### 2. Fluxo de Operação Otimizado (Checks & Registration)

O sistema deve usar o campo `events_staff.registration_check_id` para conferência rápida de credenciamento.

**A. Registration (Credenciamento)**

- **Ação:** `POST /checks/` com payload `{ action: 'registration', events_staff_id: '...' }`.
- **Lógica Backend:**
  1. Criar o registro na tabela `checks`.
  2. **Trigger/Update:** Atualizar imediatamente a coluna `registration_check_id` na tabela `events_staff` correspondente com o ID do check recém-criado.
  3. _Constraint:_ Se `events_staff.registration_check_id` já estiver preenchido, retornar erro (Staff já credenciado).

**B. Check-in / Check-out**

- **Ação:** `POST /checks/` com `check-in` ou `check-out`.
- **Validação de Credenciamento:**
  - O sistema **NÃO** deve varrer a tabela de histórico `checks`.
  - O sistema deve apenas verificar: `if events_staff.registration_check_id is NULL`.
  - Se for `NULL`: Retornar erro 400 "Staff não credenciado (Registration Required)".
  - Se `NOT NULL`: Permitir o check-in/out (respeitando a lógica sequencial in/out).

### 3. Matriz de Permissões por Role

#### 👑 ADMIN

- **Acesso:** Total.
- **Gestão de Slots:** Único capaz de criar `user_invites`.

#### 🏢 COMPANY

- **Projetos/Eventos:** Read-Only onde participa.
- **Staffs:** CRUD apenas nos seus.
- **Check-in:** Read-Only.

#### 🛂 CONTROL

- **Escopo:** Operacional Global (Registration, Check-in, Check-out).
- **Visibilidade:** Vê lista de staffs do evento (Nome + CPF) para operação.

---

## 📡 Endpoints Específicos & Requisitos

### Dashboard (`/api/v1/dashboard/`)

- **GET /metrics/**:
  - JSON: `{ "activeEvents": int, "totalProjects": int, "totalCompanies": int, "totalUsers": int }`

### Overviews

- **GET /api/v1/projects/{id}/overview/**: Dados sumarizados do projeto.
- **GET /api/v1/events/{id}/overview/**:
  - Totais globais ou por empresa dependendo da role.

### Bulk Actions (`/api/v1/events/{id}/staff/bulk/`)

- Ignora `company_id` do payload; usa a do usuário logado.
- Sanitiza CPFs.
- Realiza Upsert de Staffs e vinculação ao evento.

### Checks (`/api/v1/checks/`)

- **Validar Registration:** Verificar coluna `events_staff.registration_check_id`.
- **Atomicidade:** A criação de um check 'registration' deve ser atômica com a atualização do `events_staff` (Transaction).

---

## 📝 Serializers Pattern

- **UserSerializer:** Sem senha.
- **StaffCheckinSerializer:** (Para o Control) Deve retornar:
  - `is_registered` (Boolean: calculado se `registration_check_id` != null).
  - `last_status` (Enum: último check realizado).
