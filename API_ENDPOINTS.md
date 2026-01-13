# 🔐 DoeCerto API - Documentação Completa de Endpoints

**Versão**: 1.0.0  
**Data de Atualização**: 12 de janeiro de 2026  
**Status**: Em Produção

---

## 📋 Legenda de Autorização

| Símbolo | Significado |
|---------|-----------|
| 🔓 | **Public** - Sem autenticação |
| 🔒 | **Authenticated** - Requer JWT |
| 👤 | **Donor Only** - Apenas doadores |
| 🏢 | **ONG Only** - Apenas ONGs |
| 👑 | **Admin Only** - Apenas administradores |
| 🔑 | **Self or Admin** - Próprio usuário ou admin |

---

## 🔐 Autenticação (`/auth`)

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
- **Response**: Detalhes completos da doação

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

### PATCH `/donations/:id/accept` 🏢
- **Descrição**: Aceitar doação (marca como COMPLETED)
- **Autorização**: Apenas ONG receptora
- **Params**: `id: number`
- **Status HTTP**: 200 OK
- **Validação**: ONG verificada e dona da doação

### PATCH `/donations/:id/reject` 🏢
- **Descrição**: Rejeitar doação (marca como CANCELED)
- **Autorização**: Apenas ONG receptora
- **Params**: `id: number`
- **Status HTTP**: 200 OK
- **Validação**: Doação em status PENDING

### DELETE `/donations/:id` 👤
- **Descrição**: Cancelar doação (marca como CANCELED)
- **Autorização**: Apenas doadores
- **Params**: `id: number`
- **Lógica**: Internamente chama `update` com `status: CANCELED`

---

## 👥 ONG Profiles (`/ong-profiles`)

### POST `/ong-profiles/:userId` 🏢
- **Descrição**: Criar ou atualizar perfil de ONG
- **Autorização**: Apenas ONGs (self)
- **Params**: `userId: number`
- **Content-Type**: `multipart/form-data` (suporta upload de avatar)
- **Body**:
  ```json
  {
    "bio": "string (máx 500 caracteres)",
    "contactNumber": "string (máx 20 caracteres)",
    "websiteUrl": "string (máx 255 caracteres)",
    "address": "string (máx 255 caracteres)",
    "file": "image file (opcional)"
  }
  ```
- **Response**: Perfil completo com avatar processado
- **Processamento de Imagem**:
  - Recorte automático para 1:1
  - Redimensionamento para 512x512px
  - Compressão JPEG
  - Salvo em `/uploads/profiles/`

### GET `/ong-profiles/:userId` 🔓
- **Descrição**: Visualizar perfil de ONG
- **Autorização**: Público (qualquer pessoa pode ver)
- **Params**: `userId: number`
- **Response**: 
  ```json
  {
    "id": "number",
    "bio": "string",
    "avatarUrl": "string (caminho relativo)",
    "contactNumber": "string",
    "websiteUrl": "string",
    "address": "string",
    "ongId": "number",
    "ong": { ... }
  }
  ```

---

## 🎁 Wishlist Items (`/wishlist-items`)

### POST `/wishlist-items` 🏢
- **Descrição**: Criar item na lista de desejos
- **Autorização**: Apenas ONGs
- **Body**:
  ```json
  {
    "description": "string (obrigatório, máx 255 caracteres)",
    "quantity": "number (obrigatório, inteiro positivo)"
  }
  ```
- **Response**: Item criado com ID
- **Validação**: Usuário logado deve ser ONG

### GET `/wishlist-items/ong/:ongId` 🔓
- **Descrição**: Listar todos os itens da wishlist de uma ONG
- **Autorização**: Público
- **Params**: `ongId: number`
- **Response**: Array de wishlist items da ONG
- **Uso**: Doadores podem ver o que a ONG precisa

### GET `/wishlist-items/:id` 🔓
- **Descrição**: Visualizar item específico da wishlist
- **Autorização**: Público
- **Params**: `id: number`
- **Response**: Detalhes do item

### PATCH `/wishlist-items/:id` 🏢
- **Descrição**: Atualizar item da wishlist
- **Autorização**: Apenas ONG proprietária do item
- **Params**: `id: number`
- **Body**: `{ description?: string, quantity?: number }`
- **Validação**: Verifica propriedade do item

### DELETE `/wishlist-items/:id` 🏢
- **Descrição**: Remover item da wishlist
- **Autorização**: Apenas ONG proprietária
- **Params**: `id: number`
- **Status HTTP**: 200 OK
- **Validação**: Verifica propriedade do item

---

## 🔒 Sistema de Autenticação e Autorização

### Guards Implementados

#### JwtAuthGuard
- Valida JWT do cookie/header
- Injeta usuário no contexto
- Retorna 401 se inválido/ausente

#### RolesGuard
- Verifica role do usuário contra `@Roles()`
- Retorna 403 se não autorizado
- Sempre usado em conjunto com JwtAuthGuard

### Roles Disponíveis

| Role | Descrição | Permissões |
|------|-----------|-----------|
| `donor` | Doador | Criar doações, ver próprio histórico |
| `ong` | Organização | Receber doações, gerenciar perfil e wishlist |
| `admin` | Administrador | Verificar ONGs, gerenciar admins, ver estatísticas |

### Decorators Personalizados

```typescript
@Roles('donor', 'ong')  // Controla autorização
@CurrentUser()           // Injeta usuário logado
@UseGuards(JwtAuthGuard, RolesGuard) // Aplica guards
```

---

## 📊 Estrutura de Dados

### Enums Importantes

#### DonationType
- `monetary`: Doação em dinheiro
- `material`: Doação de materiais

#### DonationStatus
- `pending`: Aguardando resposta da ONG
- `completed`: Aceita pela ONG
- `canceled`: Cancelada pelo doador ou ONG

#### VerificationStatus
- `pending`: Aguardando verificação admin
- `verified`: Aprovada por admin
- `rejected`: Rejeitada por admin

#### Role
- `donor`: Pessoa física doadora
- `ong`: Organização não-governamental
- `admin`: Administrador do sistema

---

## 🎯 Fluxos de Negócio

### 1️⃣ Fluxo de Registro e Autenticação
```
Novo Usuário → POST /auth/register/donor|ong 
            → Valida dados (email, CPF/CNPJ)
            → Hash senha (bcrypt 10 rounds)
            → Transação: cria User + Donor/Ong
            → Gera JWT
            → Retorna token em cookie httpOnly
            → Usuário autenticado ✅
```

### 2️⃣ Fluxo de Doação Monetária
```
Doador → POST /donations (monetário)
      → Valida ONG existe e está verificada
      → Cria doação com status PENDING
      → ONG recebe notificação (futura)
      
ONG → GET /donations/received
   → Vê doação
   → PATCH /donations/:id/accept
   → Status muda para COMPLETED ✅
```

### 3️⃣ Fluxo de Doação Material
```
Doador → POST /donations (material)
       → Inclui description e quantity
       → Cria doação com status PENDING
       
ONG → PATCH /donations/:id (atualiza description/quantity)
   → Ou PATCH /donations/:id/accept
   
Doador → Pode PATCH para atualizar enquanto PENDING
       → Ou DELETE para cancelar
```

### 4️⃣ Fluxo de Verificação de ONG (Admin)
```
ONG registra → verificationStatus = pending

Admin → GET /admins/ongs/pending
     → Vê lista de ONGs aguardando
     → PATCH /admins/ongs/:ongId/approve
     → VerificationStatus = verified
     
Agora ONGs podem receber doações ✅
```

### 5️⃣ Fluxo de Perfil e Wishlist da ONG
```
ONG → POST /ong-profiles/:userId
    → Envia: bio, contactNumber, websiteUrl, address, avatar
    → Avatar processado: 512x512px, JPEG
    → Salvo em /uploads/profiles/
    
ONG → POST /wishlist-items
    → Adiciona itens que precisa
    
Doadores → GET /ong-profiles/:userId
        → Vê perfil e avatar
        → GET /wishlist-items/ong/:ongId
        → Vê o que a ONG precisa
```

---

## 💡 Exemplos de Uso com cURL

### 1. Registrar como Doador
```bash
curl -X POST http://localhost:3000/auth/register/donor \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "cpf": "12345678901"
  }' \
  -c cookies.txt
```

### 2. Registrar como ONG
```bash
curl -X POST http://localhost:3000/auth/register/ong \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ONG Esperança",
    "email": "ong@example.com",
    "password": "senha123",
    "cnpj": "12345678000195"
  }' \
  -c cookies.txt
```

### 3. Criar Doação Monetária
```bash
curl -X POST http://localhost:3000/donations \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "ongId": 1,
    "donationType": "monetary",
    "monetaryAmount": 100.00,
    "monetaryCurrency": "BRL"
  }'
```

### 4. Criar Doação Material
```bash
curl -X POST http://localhost:3000/donations \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "ongId": 1,
    "donationType": "material",
    "materialDescription": "5 caixas de alimentos não-perecíveis",
    "materialQuantity": 5
  }'
```

### 5. Enviar Comprovante de Pagamento
```bash
curl -X POST http://localhost:3000/donations \
  -F "proofFile=@/caminho/para/comprovante.jpg" \
  -F 'createDonationDto={
    "ongId": 1,
    "donationType": "monetary",
    "monetaryAmount": 50.00,
    "monetaryCurrency": "BRL"
  };type=application/json' \
  -b cookies.txt
```

### 6. Atualizar Perfil de ONG
```bash
curl -X POST http://localhost:3000/ong-profiles/1 \
  -F "file=@/caminho/para/avatar.jpg" \
  -F 'createOngProfileDto={
    "bio": "ONG focada em educação infantil",
    "contactNumber": "(11) 98765-4321",
    "websiteUrl": "https://exemplo.org",
    "address": "Rua das Flores, 123, São Paulo"
  };type=application/json' \
  -b cookies.txt
```

### 7. Listar Doações Enviadas (Doador)
```bash
curl -X GET http://localhost:3000/donations/sent \
  -b cookies.txt
```

### 8. Listar Doações Recebidas (ONG)
```bash
curl -X GET http://localhost:3000/donations/received \
  -b cookies.txt
```

### 9. Aceitar Doação (ONG)
```bash
curl -X PATCH http://localhost:3000/donations/1/accept \
  -b cookies.txt
```

### 10. Listar ONGs Pendentes (Admin)
```bash
curl -X GET http://localhost:3000/admins/ongs/pending \
  -b cookies.txt
```

### 11. Aprovar ONG (Admin)
```bash
curl -X PATCH http://localhost:3000/admins/ongs/1/approve \
  -b cookies.txt
```

### 12. Rejeitar ONG (Admin)
```bash
curl -X PATCH http://localhost:3000/admins/ongs/1/reject \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"reason": "Documentação incompleta"}'
```

### 13. Ver Wishlist de ONG
```bash
curl -X GET http://localhost:3000/wishlist-items/ong/1
```

### 14. Adicionar Item à Wishlist (ONG)
```bash
curl -X POST http://localhost:3000/wishlist-items \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "description": "Notebooks para aula de informática",
    "quantity": 10
  }'
```

---

## ⚠️ Códigos de Status HTTP e Tratamento de Erros

### Sucesso (2xx)
- `200 OK`: Requisição bem-sucedida, retorna dados
- `201 Created`: Recurso criado (POST bem-sucedido)
- `204 No Content`: Operação bem-sucedida, sem corpo

### Erros de Cliente (4xx)

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Cannot donate to an unverified ONG. Please choose a verified organization."
}
```
Causas comuns:
- ONG não verificada
- Doação monetária com campos materiais
- Atualizar doação COMPLETED/CANCELED
- CPF/CNPJ inválido
- Email já registrado

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
Causas:
- JWT ausente ou inválido
- Cookie expirado
- Credenciais incorretas no login

#### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```
Causas:
- Role insuficiente (ex: donor tentando ser ONG)
- Tentando atualizar perfil de outro usuário
- ONG tentando alterar dados de outro item wishlist

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "ONG with id 999 not found"
}
```

#### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email already in use"
}
```

### Erros de Servidor (5xx)
- `500 Internal Server Error`: Erro no servidor

---

## 🔐 Segurança Implementada

### Autenticação
- ✅ JWT com assinatura HMAC
- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ Cookies httpOnly (não acessível via JavaScript)
- ✅ CORS configurado apenas para frontend

### Autorização
- ✅ Guards em todos os endpoints protegidos
- ✅ Verificação de propriedade (pode-se atualizar apenas próprios dados)
- ✅ Validação de role em controllers

### Validação de Dados
- ✅ DTOs com class-validator
- ✅ Validações brasileiras (CPF, CNPJ)
- ✅ ParseIntPipe para IDs
- ✅ Whitelist de campos em DTOs

### Proteção de Dados
- ✅ Senhas nunca retornadas em responses
- ✅ Transações Prisma para atomicidade
- ✅ Soft delete não implementado (dados históricos mantidos)

---

## 📝 Notas Importantes de Implementação

### 1. Endpoints para Remover em Produção
Os seguintes endpoints são públicos e devem ser removidos/protegidos:
- `POST /donors` - Use apenas `/auth/register/donor`
- `POST /ongs` - Use apenas `/auth/register/ong`

### 2. Tratamento de Imagens
- **Avatares**: Processados com Sharp, reduzidos para 512x512px
- **Comprovantes**: Armazenados originais em `/uploads/payment-proofs/`
- **Localização**: `/uploads/` na raiz do backend

### 3. Regras de Negócio Críticas
- ❌ Não é possível doar para ONG não verificada
- ❌ Doações monetárias só podem ser canceladas
- ❌ Doações em status COMPLETED/CANCELED não podem ser alteradas
- ✅ Doações nunca são deletadas, apenas marcadas como CANCELED

### 4. Transações Garantidas
- Criação de User + Donor/Ong é atômica
- Se falhar, nada é criado

### 5. Histórico e Auditoria
- Todas as doações são mantidas (incluindo canceladas)
- Campo `updatedAt` registra últimas mudanças
- Campo `verifiedAt` registra quando ONG foi verificada

### 6. Performance
Para otimização, ver: `PERFORMANCE_OPTIMIZATION_REPORT.md`

---

## 📞 Suporte e Contato

Para dúvidas sobre a API, consulte:
- 📖 [Relatório de Otimização](./PERFORMANCE_OPTIMIZATION_REPORT.md)
- 📋 [README](./README.md)

---

**Última atualização**: 12 de janeiro de 2026  
**Versão da API**: 1.0.0  
**Status**: Em Produção ✅
