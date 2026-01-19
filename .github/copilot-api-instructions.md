## 🗄️ Schema do Banco de Dados

### Entidades Principais

#### `company`

- **id** (PK): Identificador único da empresa
- **name**: Nome da empresa
- **cnpj**: Número de registro da empresa brasileira (Único)

#### `users`

- **id** (PK): Identificador do usuário
- **name**: Nome completo do usuário
- **email**: Endereço de e-mail do usuário
- **role**: Função do usuário (`admin`, `company`, `control`)
- **company_id** (FK): Referência à empresa
- **created_At** : Timestamp de quando foi criado

#### `staffs`

- **id** (PK): Identificador do funcionário
- **name**: Nome completo do funcionário
- **cpf**: CPF brasileiro (Único)
- **company_id** (FK): Referência à empresa
- **created_At** : Timestamp de quando foi criado

### Gerenciamento de Projetos e Eventos

#### `projects`

- **id** (PK): Identificador do projeto
- **name**: Nome do projeto
- **status**: Status do projeto (`open`, `close`)
- **company_id** (FK): Referência à empresa

#### `events`

- **id** (PK): Identificador do evento
- **name**: Nome do evento
- **date_begin**: Data de início do evento
- **date_end**: Data de término do evento
- **status**: Status do evento (`open`, `close`)
- **project_id** (FK): Referência ao projeto

### Tabelas de Relacionamento

#### `events_company`

- **id** (PK)
- **role**: Função da empresa (`production`, `service`)
- **event_id** (FK): Referência ao evento
- **company_id** (FK): Referência à empresa

#### `events_user`

- **id** (PK)
- **user_id** (FK): Referência ao usuário
- **event_id** (FK): Referência ao evento

#### `events_staff`

- **id** (PK)
- **event_id** (FK): Referência ao evento
- **staff_cpf** (FK): Referência ao CPF do funcionário

### Operações

#### `checks`

- **id** (PK): Identificador do check
- **action**: Tipo de ação (`check-in`, `check-out`)
- **timestamp**: Timestamp do check
- **events_staff_id** (FK): Referência à atribuição do funcionário ao evento
- **user_control_id** (FK): Referência ao usuário de controle

# Rules

- Desenvolva a api mantendo o schema mais fiel ao descrito aqui.
- Cada empresa só pode requisitar e ver os dados dos staffs e usuários cadastrados para a sua empresa.
- Cada empresa só pode ver os eventos e projetos na qual participa.
- A empresa só pode adicionar funcionários para a sua própria empresa.
- empresa -> roles production ou service
- A requisição deve ser feita de acordo com roles:
  - admin: tem acesso total de leitura e escrita
  - production:
    - visualiza apenas os eventos e projetos a qual participa
    - tem os dados de overview de todas as empresas dos projetos e eventos que participa
    - consegue ver e acessar apenas seus próprios staffs mas consegue ver a quantidade e status de checkin dos staffs das empresas participantes no evento e projeto na qual participa.
    - pode criar e atribuir a eventos apenas seus staffs
    - não pode criar e nem adicionar projetos, eventos e empresas
    - não pode fazer checkin, checkout ou credenciated
  - service
    - visualiza apenas os eventos e projetos a qual participa
    - não consegue visualizar quais são as outras empresas participantes
    - tem os dados de overview apenas da sua empresa nos projetos e eventos que participa
    - consegue ver e acessar apenas seus próprios staffs, assim como o status de checkin apenas dos seus staffs
    - pode criar e atribuir a eventos apenas seus staffs
    - não pode criar e nem adicionar projetos, eventos e empresas
    - não pode fazer checkin, checkout ou credenciated
  - control
    - pode fazer checkin, checkout ou credenciated
    - consegue ter visualização total de empresas, staffs e overview
    - não pode criar e atribuir staffs, empresas ou projetos.
