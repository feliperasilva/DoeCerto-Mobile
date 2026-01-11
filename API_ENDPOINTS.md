# 🔐 API Endpoints - DoeCerto Backend

Documentação completa de todos os endpoints com autenticação e autorização.

## 📋 Legenda
- 🔓 **Public**: Endpoint público (sem autenticação)
- 🔒 **Authenticated**: Requer autenticação (JWT)
- 👤 **Donor Only**: Apenas doadores
- 🏢 **ONG Only**: Apenas ONGs
- 👑 **Admin Only**: Apenas administradores
- 🔑 **Self or Admin**: Próprio usuário ou administrador

---

## 🔐 Authentication (`/auth`)

### POST `/auth/login` 🔓
- **Descrição**: Login de usuário
- **Body**: `{ email: string, password: string }`
- **Response**: Cookie com JWT + mensagem de sucesso

### POST `/auth/register/donor` 🔓
- **Descrição**: Registro de novo doador
- **Body**: `{ name, email, password, cpf }`
- **Response**: Cookie com JWT + mensagem de sucesso

### POST `/auth/register/ong` 🔓
- **Descrição**: Registro de nova ONG
- **Body**: `{ name, email, password, cnpj }`
- **Response**: Cookie com JWT + mensagem de sucesso

### POST `/auth/logout` 🔒
- **Descrição**: Logout do usuário
- **Response**: Limpa cookie e retorna mensagem

---

## 👑 Admins (`/admins`)

> Todas as rotas abaixo exigem autenticação (`JwtAuthGuard`) e role `admin` (`RolesGuard`).

### POST `/admins` 👑
- **Descrição**: Criar novo administrador
- **Body**: `{ name: string, email: string, password: string }`
- **Response**: Admin criado

### DELETE `/admins/:adminId` 👑
- **Descrição**: Deletar administrador
- **Params**: `adminId: number`
- **Response**: `204 No Content`

### GET `/admins/ongs/pending` 👑
- **Descrição**: Listar ONGs pendentes de verificação

### GET `/admins/ongs/verified` 👑
- **Descrição**: Listar ONGs já verificadas/aprovadas

### GET `/admins/ongs/rejected` 👑
- **Descrição**: Listar ONGs rejeitadas

### PATCH `/admins/ongs/:ongId/approve` 👑
- **Descrição**: Aprovar e marcar ONG como verificada
- **Params**: `ongId: number`
- **Response**: ONG atualizada como `VERIFIED`

### PATCH `/admins/ongs/:ongId/reject` 👑
- **Descrição**: Rejeitar ONG com justificativa
- **Params**: `ongId: number`
- **Body**: `{ reason: string }`
- **Response**: ONG atualizada como `REJECTED`

### GET `/admins/stats/me` 👑
- **Descrição**: Estatísticas do admin logado (aprovações/rejeições realizadas)

### GET `/admins/stats/:adminId` 👑
- **Descrição**: Estatísticas de um admin específico
- **Params**: `adminId: number`

## 👥 Users (`/users`)

### POST `/users` 👑
- **Descrição**: Criar usuário diretamente (não via registro)
- **Autorização**: Admin only
- **Body**: `CreateUserDto`

### GET `/users` 👑
- **Descrição**: Listar todos os usuários
- **Autorização**: Admin only

### GET `/users/:id` 🔑
- **Descrição**: Visualizar perfil de usuário
- **Autorização**: Próprio usuário ou admin
- **Params**: `id: number`

### PATCH `/users/:id` 🔑
- **Descrição**: Atualizar perfil de usuário
- **Autorização**: Próprio usuário ou admin
- **Params**: `id: number`
- **Body**: `UpdateUserDto`

### DELETE `/users/:id` 👑
- **Descrição**: Deletar usuário
- **Autorização**: Admin only
- **Params**: `id: number`

---

## 👤 Donors (`/donors`)

### POST `/donors` 🔓
- **Descrição**: Criar doador (usado apenas via `/auth/register/donor`)
- **Body**: `CreateDonorDto`
- **Nota**: Em produção, remover este endpoint público

### GET `/donors` 👑
- **Descrição**: Listar todos os doadores
- **Autorização**: Admin only

### GET `/donors/:id` 🔒
- **Descrição**: Visualizar perfil de doador
- **Autorização**: Qualquer usuário autenticado
- **Params**: `id: number`

### PATCH `/donors/:id` 👤
- **Descrição**: Atualizar perfil de doador
- **Autorização**: Apenas o próprio doador
- **Params**: `id: number`
- **Body**: `UpdateDonorDto`
- **Validação**: Verifica se `user.id === id`

### DELETE `/donors/:id` 👑
- **Descrição**: Deletar doador
- **Autorização**: Admin only
- **Params**: `id: number`

---

## 🏢 ONGs (`/ongs`)

### POST `/ongs` 🔓
- **Descrição**: Criar ONG (usado apenas via `/auth/register/ong`)
- **Body**: `CreateOngDto`
- **Nota**: Em produção, remover este endpoint público

### GET `/ongs` 🔓
- **Descrição**: Listar todas as ONGs
- **Público**: Para que doadores possam navegar

### GET `/ongs/:id` 🔓
- **Descrição**: Visualizar perfil da ONG
- **Público**: Para que doadores vejam detalhes
- **Params**: `id: number`

### PATCH `/ongs/:id` 🏢
- **Descrição**: Atualizar perfil da ONG
- **Autorização**: Apenas a própria ONG
- **Params**: `id: number`
- **Body**: `UpdateOngDto`
- **Validação**: Verifica se `user.id === id`

### DELETE `/ongs/:id` 👑
- **Descrição**: Deletar ONG
- **Autorização**: Admin only
- **Params**: `id: number`

---

## 🎁 Donations (`/donations`)

### POST `/donations` 👤
- **Descrição**: Criar nova doação
- **Autorização**: Apenas doadores
- **Body**: `CreateDonationDto { ongId, donationType, monetaryAmount?, materialDescription?, ... }`
- **Validação**: 
  - `donorId` é automaticamente o ID do usuário logado
  - ⚠️ **A ONG deve estar verificada** (`isVerified: true`)
  - A ONG deve existir no sistema

### GET `/donations` 🔒
- **Descrição**: Listar todas as doações
- **Autorização**: Qualquer usuário autenticado

### GET `/donations/sent` 👤
- **Descrição**: Listar doações enviadas pelo doador logado
- **Autorização**: Apenas doadores
- **Query**: `?type=monetary|material` (opcional)
- **Lógica**: Retorna doações onde `donorId` = ID do usuário logado

### GET `/donations/received` 🏢
- **Descrição**: Listar doações recebidas pela ONG logada
- **Autorização**: Apenas ONGs
- **Query**: `?type=monetary|material` (opcional)
- **Lógica**: Retorna doações onde `ongId` = ID do usuário logado

### GET `/donations/donor/:donorId` 🔒
- **Descrição**: Listar doações de um doador específico
- **Autorização**: Próprio doador ou admin
- **Params**: `donorId: number`
- **Query**: `?type=monetary|material` (opcional)
- **Validação**: Verifica se `user.id === donorId` ou `user.role === 'admin'`

### GET `/donations/ong/:ongId` 🔒
- **Descrição**: Listar doações para uma ONG específica
- **Autorização**: Própria ONG ou admin
- **Params**: `ongId: number`
- **Query**: `?type=monetary|material` (opcional)
- **Validação**: Verifica se `user.id === ongId` ou `user.role === 'admin'`

### GET `/donations/:id` 🔒
- **Descrição**: Visualizar doação específica
- **Autorização**: Qualquer usuário autenticado
- **Params**: `id: number`

### PATCH `/donations/:id` 🔒
- **Descrição**: Atualizar doação
- **Autorização**: Donor (proprietário) ou ONG (destinatária)
- **Params**: `id: number`
- **Body**: `UpdateDonationDto { donationStatus?, materialDescription?, materialQuantity? }`
- **Regras de Negócio** (validadas no service):
  - **Donors** podem:
    - Atualizar descrição/quantidade de doações materiais pendentes
    - Cancelar doações pendentes
  - **ONGs** podem:
    - Marcar doações como COMPLETED ou CANCELED
    - Não podem alterar descrição/quantidade
  - **Doações monetárias**: Apenas podem ser canceladas
  - **Status terminal**: CANCELED e COMPLETED não podem ser alterados

### DELETE `/donations/:id` 👤
- **Descrição**: Cancelar doação (marca como CANCELED)
- **Autorização**: Apenas doadores
- **Params**: `id: number`
- **Lógica**: Internamente chama `update` com `status: CANCELED`

---

## 🔒 Guards e Decorators Utilizados

### Guards
- **JwtAuthGuard**: Valida JWT e autentica usuário
- **RolesGuard**: Verifica se usuário tem role necessária

### Decorators
- **@Roles(...roles)**: Define quais roles podem acessar
- **@CurrentUser()**: Injeta usuário autenticado no controller
- **@UseGuards(JwtAuthGuard, RolesGuard)**: Aplica guards

### Roles Disponíveis
- `admin`: Administrador do sistema
- `donor`: Doador
- `ong`: Organização

---

## 🎯 Exemplos de Uso

### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "senha123"}' \
  -c cookies.txt
```

### 2. Criar Doação (com cookie de autenticação)
```bash
curl -X POST http://localhost:3000/donations \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "ongId": 1,
    "donationType": "monetary",
    "monetaryAmount": 100,
    "monetaryCurrency": "BRL"
  }'
```

### 3. Ver Doações Enviadas (como Doador)
```bash
curl -X GET http://localhost:3000/donations/sent \
  -b cookies.txt
```

### 3.1. Ver Doações Recebidas (como ONG)
```bash
curl -X GET http://localhost:3000/donations/received \
  -b cookies.txt
```

### 4. Atualizar Perfil
```bash
curl -X PATCH http://localhost:3000/donors/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"cpf": "12345678900"}'
```

---

## ⚠️ Códigos de Status HTTP

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `204 No Content`: Operação bem-sucedida sem conteúdo de retorno
- `400 Bad Request`: Dados inválidos ou regra de negócio violada
  - Ex: Tentar doar para ONG não verificada
  - Ex: Atualizar doação monetária com campos materiais
- `401 Unauthorized`: Não autenticado (JWT inválido ou ausente)
- `403 Forbidden`: Sem permissão para a ação
  - Ex: Doador tentando marcar doação como completa
  - Ex: ONG tentando atualizar outra ONG
- `404 Not Found`: Recurso não encontrado
  - Ex: ONG com ID inexistente
- `409 Conflict`: Conflito (ex: email já existe)

---

## 🔐 Segurança

### Cookies
- `httpOnly: true`: Previne acesso via JavaScript
- `secure: true` (produção): Apenas HTTPS
- `sameSite: 'strict'`: Previne CSRF
- Expiração: 24 horas

### Validações
- DTOs com class-validator
- ParseIntPipe para IDs
- Verificação de propriedade de recursos
- Hash de senhas com bcrypt (10 rounds)

---

## 📝 Notas Importantes

1. **Endpoints POST de criação direta** (`/donors`, `/ongs`): Devem ser removidos em produção, pois o registro deve ser feito via `/auth/register/*`

2. **Autorização em camadas**: Guards no controller + validações no service

3. **Histórico de doações**: Todas as doações (incluindo canceladas) são mantidas para histórico

4. **Transações**: Criação de usuários usa transações Prisma para atomicidade

5. **⚠️ ONGs Verificadas**: Só é possível doar para ONGs que tenham `isVerified: true`. Se tentar doar para uma ONG não verificada, receberá erro `400 Bad Request` com a mensagem:
   ```json
   {
     "statusCode": 400,
     "message": "Cannot donate to an unverified ONG. Please choose a verified organization."
   }
   ```

---

Última atualização: 10 de janeiro de 2026
