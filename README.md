# 🎁 DoeCerto - Backend API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<p align="center">
  Backend API para a plataforma DoeCerto - Conectando doadores e ONGs de forma transparente e segura.
</p>

<p align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-requisitos">Requisitos</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#%EF%B8%8F-configuração">Configuração</a> •
  <a href="#-executando">Executando</a> •
  <a href="#-documentação-da-api">Documentação</a> •
  <a href="#%EF%B8%8F-arquitetura">Arquitetura</a> •
  <a href="#-repositório-doecerto-frontend">Front-End</a>
</p>

---

## 📋 Sobre

O **DoeCerto Backend** é uma API RESTful de alta performance desenvolvida com NestJS que gerencia doações entre doadores e ONGs de forma segura e eficiente. A plataforma oferece:

### Funcionalidades Principais
- ✅ **Autenticação segura** - JWT com cookies httpOnly e refresh tokens
- ✅ **Gestão de usuários** - Doadores, ONGs e Administradores
- ✅ **Doações flexíveis** - Materiais (alimentos, roupas, etc.) e monetárias
- ✅ **Verificação de ONGs** - Sistema de aprovação por administradores
- ✅ **Status de doações** - Rastreamento completo (pendente, concluída, cancelada)
- ✅ **Controle de acesso** - RBAC (Role-Based Access Control)
- ✅ **Histórico completo** - Auditoria de todas as transações

### Otimizações de Performance
- ⚡ **Queries otimizadas** - Prevenção de N+1 queries com Prisma select
- ⚡ **Paginação eficiente** - Endpoints paginados com validação de limites
- ⚡ **Validação robusta** - CPF/CNPJ validados no nível de aplicação
- ⚡ **Cache de autenticação** - JWT stateless para escalabilidade

---

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

### Core
- **[NestJS](https://nestjs.com/)** v11.1.8 - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Prisma](https://www.prisma.io/)** v6.18.0 - ORM moderno para Node.js e TypeScript
- **[MySQL](https://www.mysql.com/)** 8 - Banco de dados relacional

### Autenticação & Segurança
- **[Passport.js](http://www.passportjs.org/)** - Middleware de autenticação
- **[JWT](https://jwt.io/)** - JSON Web Tokens para sessões
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Hash de senhas

### Validação
- **[class-validator](https://github.com/typestack/class-validator)** - Validação baseada em decorators
- **[class-transformer](https://github.com/typestack/class-transformer)** - Transformação de objetos
- **[@sh4rkzy/brazilian-validator](https://www.npmjs.com/package/@sh4rkzy/brazilian-validator)** - Validação de CPF/CNPJ

### Desenvolvimento
- **[ESLint](https://eslint.org/)** - Linter para JavaScript/TypeScript
- **[Prettier](https://prettier.io/)** - Formatador de código
- **[Docker](https://www.docker.com/)** - Containerização

---

## 📦 Requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- **[Node.js](https://nodejs.org/)** >= 18.x
- **[npm](https://www.npmjs.com/)** >= 9.x ou **[yarn](https://yarnpkg.com/)** >= 1.22
- **[Docker](https://www.docker.com/)** >= 20.x (opcional, para banco de dados)
- **[Docker Compose](https://docs.docker.com/compose/)** >= 2.x (opcional)
- **[Git](https://git-scm.com/)**

---

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/feliperasilva/DoeCerto-Mobile.git
cd DoeCerto-Mobile/backend
```

### 2. Instale as dependências

```bash
npm install
```

ou com yarn:

```bash
yarn install
```

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Configure as seguintes variáveis:

```env
# Database
DATABASE_URL="mysql://root:senha_root@localhost:3307/doecerto"
MYSQL_DATABASE=doecerto
MYSQL_PASSWORD=senha_user
MYSQL_ROOT_PASSWORD=senha_root

# Application
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456
JWT_EXPIRES_IN=24h
```

⚠️ **Importante**: 
- Altere `JWT_SECRET` para uma chave forte e única
- Em produção, use senhas fortes e seguras
- Nunca commite o arquivo `.env`

### 2. Banco de Dados com Docker (Recomendado)

#### Iniciar o banco de dados:

```bash
docker-compose up -d
```

Este comando irá:
- ✅ Criar um container MySQL 8
- ✅ Configurar o banco com as credenciais do `.env`
- ✅ Expor na porta `3307`
- ✅ Persistir dados em volume Docker

#### Verificar status:

```bash
docker-compose ps
```

#### Parar o banco de dados:

```bash
docker-compose down
```

#### Parar e remover volumes (⚠️ apaga dados):

```bash
docker-compose down -v
```

### 3. Banco de Dados Manual (Alternativa)

Se preferir não usar Docker, instale MySQL localmente e crie o banco:

```sql
CREATE DATABASE doecerto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Executar Migrations do Prisma

Após o banco estar rodando, execute as migrations:

```bash
npx prisma migrate dev
```

Este comando irá:
- ✅ Criar todas as tabelas no banco
- ✅ Gerar o Prisma Client
- ✅ Aplicar todas as migrations

### 5. (Opcional) Seed do Banco de Dados

Para popular o banco com dados de exemplo:

```bash
npx prisma db seed
```

---

## 🎯 Executando

### Modo Desenvolvimento

```bash
npm run start:dev
```

A API estará disponível em: `http://localhost:3000`

### Modo Produção

```bash
# Build
npm run build

# Executar
npm run start:prod
```

### Outros Comandos Úteis

```bash
# Formatar código
npm run format

# Lint e correção automática
npm run lint

# Executar testes
npm run test

# Executar testes em watch mode
npm run test:watch

# Cobertura de testes
npm run test:cov
```

---

## 📚 Documentação da API

### Endpoints Principais

A documentação completa dos endpoints está disponível em:
- **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - Documentação detalhada de todos os endpoints

### Resumo Rápido

#### 🔐 Autenticação
- `POST /auth/login` - Login com email/senha
- `POST /auth/register/donor` - Registrar doador (CPF obrigatório)
- `POST /auth/register/ong` - Registrar ONG (CNPJ obrigatório)
- `POST /auth/logout` - Logout seguro
- `GET /auth/me` - Perfil do usuário autenticado

#### 💝 Doações
- `POST /donations` - Criar doação (apenas doadores autenticados)
- `GET /donations?skip=0&take=20` - Listar doações (paginado)
- `GET /donations/:id` - Detalhes de uma doação
- `GET /donations/sent?skip=0&take=20` - Doações enviadas (doador)
- `GET /donations/received?skip=0&take=20` - Doações recebidas (ONG)
- `PATCH /donations/:id` - Atualizar status da doação
- `DELETE /donations/:id` - Cancelar doação

#### 🏢 ONGs
- `GET /ongs?skip=0&take=20` - Listar ONGs verificadas (paginado)
- `GET /ongs/:id` - Ver perfil completo da ONG
- `PATCH /ongs/:id` - Atualizar perfil (própria ONG)

#### 👥 Doadores
- `GET /donors?skip=0&take=20` - Listar doadores (admin, paginado)
- `GET /donors/:id` - Ver perfil do doador
- `PATCH /donors/:id` - Atualizar perfil (próprio doador)

#### ⚙️ Administração
- `POST /admins/approve-ong/:id` - Aprovar ONG
- `POST /admins/reject-ong/:id` - Rejeitar ONG
- 1. Registrar doador
curl -X POST http://localhost:3000/auth/register/donor \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "cpf": "12345678901"
  }'

# 2. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@example.com", "password": "senha123"}' \
  -c cookies.txt

# 3. Listar ONGs (com paginação)
curl -X GET "http://localhost:3000/ongs?skip=0&take=10" \
  -H "Content-Type: application/json" \
  -b cookies.txt

# 4. Criar doação material
curl -X POST http://localhost:3000/donations \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "ongId": 1,
    "donationType": "material",
    "materialDescription": "10 pacotes de arroz de 5kg",
    "materialQuantity": 10
  }'

# 5. Criar doação monetária
curl -X POST http://localhost:3000/donations \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "ongId": 1,
    "donationType": "monetary",
    "monetaryAmount": 150.50,
    "monetaryCurrency": "BRL",
    "proofOfPaymentUrl": "/uploads/comprovante.jpg"
  }'

# 6. Ver minhas doações enviadas (paginado)
curl -X GET "http://localhost:3000/donations/sent?skip=0&take=20" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

#### Com Postman/Insomnia:

1. **Configure o ambiente**
   - Variável `BASE_URL`: `http://localhost:3000`
   - Habilite "Automatically follow redirects"
   - Habilite "Enable cookie jar"

2. **Faça o login**
   - POST `{{BASE_URL}}/auth/login`
   - O cookie JWT será salvo automaticamente

3. **Use os endpoints protegidos**
   - Os cookies são enviados automaticamente
   - Não precisa adicionar headers manualmente

4. **Testando paginação**
   - Adicione query params: `?skip=0&take=20`
   - Valores padrão: skip=0, take=20
   - Máximo permitido: take=100

#### Exemplo de Resposta Paginada:

```json
{ NestJS**: Organização por feature (donations, ongs, donors, auth)
- **DTOs (Data Transfer Objects)**: Validação e transformação automática com `class-validator`
- **Guards**: Proteção de rotas (JwtAuthGuard, RolesGuard)
- **Decorators Customizados**: `@CurrentUser()`, `@Roles()`, `@Public()`
- **Services**: Lógica de negócio e regras de domínio
- **Controllers**: Camada HTTP com validação de entrada
- **Repository Pattern**: Prisma Service como única camada de acesso ao BD
- **Dependency Injection**: Injeção de dependências nativa do NestJS

### Princípios de Performance Aplicados

1. **Query Optimization**
   - ✅ Uso de `select` específico ao invés de `include` genérico
   - ✅ Prevenção de N+1 queries com eager loading seletivo
   - ✅ Projeção de apenas campos necessários

2. **Paginação**
   - ✅ Todos os endpoints de listagem são paginados
   - ✅ Validação de limites (máximo 100 itens por página)
   - ✅ Retorno de metadados de paginação (total, páginas)

3. **Validação em Camadas**
   - ✅ DTOs validados no controller (class-validator)
   - ✅ Validação de negócio no service
   - ✅ Constraints no banco de dados (Prisma schema)

4. **Segurança**
   - ✅ Senhas nunca retornadas nas queries
   - ✅ JWT stateless para escalabilidade
   - ✅ Validação de CPF/CNPJ antes de persistir
Cliente → POST /donations
            ↓
       JwtAuthGuard ✓ (verifica token válido)
            ↓
       RolesGuard ✓ (verifica role = 'donor')
            ↓
       DonationsController (valida DTO)
            ↓
       DonationsService
            ↓
       ├─ Verifica se ONG existe
       ├─ Verifica se ONG está verificada
       ├─ Valida dados da doação (tipo, valores)
       ↓
       Prisma.donation.create({
         data: { ... },
         select: { 
           id, donationType, donationStatus,
           ong: { select: { userId, user: { select: { name } } } },
           donor: { select: { userId, user: { select: { name } } } }
         }
       })
            ↓
       Retorna doação criada (sem dados sensíveis)
```

### Fluxo de Aprovação de ONG (Admin)

```
Admin → POST /admins/approve-ong/:id
            ↓
       JwtAuthGuard ✓
            ↓
       RolesGuard ✓ (verifica role = 'admin')
            ↓
       AdminsController
            ↓
       AdminsService
            ↓
       ├─ Verifica se ONG existe
       ├─ Verifica se está pendente
       ↓
       Prisma.$transaction([
         ong.update({ verificationStatus: 'verified', verifiedById: adminId }),
         // outros updates...
       ])
            ↓
       Retorna ONG atualiz
        }
      }
    }
  ],
  "pagination": {
    "skip": 0,
    "take": 20,
    "total": 50,
    "pages": 3
  }
}
```
  }'
```

#### Com Postman/Insomnia:

1. Importe a collection (se disponível)
2. Configure o ambiente com `BASE_URL=http://localhost:3000`
3. Faça login - o cookie será salvo automaticamente
4. Use os demais endpoints normalmente

---

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
backend/
├── src/
│   ├── admins/           # Módulo de administradores
│   ├── auth/             # Autenticação e autorização
│   │   ├── decorators/   # Decorators customizados (@CurrentUser, @Roles)
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── guards/       # Guards de autenticação e roles
│   │   └── strategies/   # Estratégias Passport (JWT)
│   ├── common/           # Código compartilhado
│   │   └── utils/        # Utilitários (validação, formatação)
│   ├── donations/        # Módulo de doações
│   │   ├── dto/          # DTOs de doações
│   │   ├── donations.controller.ts
│   │   ├── donations.service.ts
│   │   └── donations.module.ts
│   ├── donors/           # Módulo de doadores
│   ├── ongs/             # Módulo de ONGs
│   ├── prisma/           # Prisma service e módulo
│   ├── users/            # Módulo de usuários
│   └── main.ts           # Entry point da aplicação
├── prisma/
│   ├── schema.prisma     # Schema do banco de dados
│   └── migrations/       # Histórico de migrations
├── generated/            # Prisma Client gerado
├── docker-compose.yml    # Configuração Docker
├── .env                  # Variáveis de ambiente (não versionado)
├── package.json
└── tsconfig.json
```

### Padrões Utilizados

- **Módulos**: Organização por feature (donations, ongs, donors)
- **DTOs**: Validação e transformação de dados de entrada
- **Guards**: Proteção de rotas com autenticação e autorização
- **Services**: Lógica de negócio centralizada
- **Controllers**: Camada de roteamento e validação
- **Repository Pattern**: Prisma Service como camada de acesso a dados

### Fluxo de Autenticação

```
Cliente → Login → AuthService
                     ↓
                Valida credenciais
                     ↓
                Gera JWT
                     ↓
              Armazena em cookie
                     ↓
         Próximas requisições → JwtAuthGuard
                                      ↓
            Tabela base de usuários
  - Campos: id, name, email, password (hash), role, timestamps
  - Relacionamentos: 1-1 com Donor, Ong ou Admin

- **Donor**: Perfil de doadores
  - Campos: userId (PK), cpf (unique), timestamps
  - Relacionamentos: 1-N com Donation (doações enviadas)

- **Ong**: Perfil de ONGs
  - Campos: userId (PK), cnpj (unique), verificationStatus, verifiedById, rejectionReason
  - Status: pending, verified, rejected
  - Relacionamentos: 1-N com Donation (doações recebidas), 1-1 com OngProfile

- **OngProfile**: Perfil detalhado da ONG
  - Campos: bio, avatarUrl, contactNumber, websiteUrl, address

- **Donation**: Registro de doações
  - Campos: id, donationType (monetary/material), donationStatus (pending/completed/canceled)
  - Campos monetários: monetaryAmount, monetaryCurrency, proofOfPaymentUrl
  - Campos materiais: materialDescription, materialQuantity
  - Relacionamentos: N-1 com Donor, N-1 com Ong

- **Admin**: Perfil de administradores
  - Campos: userId (PK)
  - Relacionamentos: 1-N com Ong (ONGs verificadas por este admin)

- **WishlistItem**: Lista de desejos de ONGs
  - Campos: id, ongId, description, quantity

### Índices para Performance

```prisma
// Índices implementados para queries otimizadas
@@index([email]) // User - lookup rápido no login
@@index([verificationStatus]) // Ong - filtrar por status
@@index([donorId, donationStatus]) // Donation - doações do donor por status
@@index([ongId, donationStatus]) // Donation - doações da ong por status
@@index([donorId, createdAt]) // Donation - histórico ordenado
@@index([ongId, createdAt]) // Donation - histórico ordenado
```
                                 Controller
```

### Fluxo de Doação

#### Autenticação e Autorização
- ✅ **Passwords**: Hash com bcrypt (10 salt rounds)
- ✅ **JWT**: Tokens assinados com secret forte, expiração de 24h
- ✅ **Cookies**: httpOnly (não acessível via JS), secure (HTTPS em prod), sameSite: strict
- ✅ **RBAC**: Sistema de roles (admin, donor, ong) com Guards
- ✅ **Stateless**: JWT permite escalabilidade horizontal

#### Validação de Dados
- ✅ **DTOs**: Validação automática com class-validator
- ✅ **CPF/CNPJ**: Validação com biblioteca @sh4rkzy/brazilian-validator
- ✅ **Email**: Validação de formato e unicidade
- ✅ **Sanitização**: Class-transformer remove campos extras

#### Proteção de Banco de Dados
- ✅ **SQL Injection**: Prisma ORM com prepared statements automático
- ✅ **Constraints**: Unique, foreign keys, não-nulos definidos no schema
- ✅ **Transactions**: Operações críticas envolvidas em transações
- ✅ **Cascata**: Delete em cascata para manter integridade

#### Segurança de API
- ✅ **CORS**: Configurado para origem específica do frontend
- ✅ **Rate Limiting**: (Recomendado implementar para produção)
- ✅ **Helmet**: (Recomendado para headers de segurança)
- ✅ **Logging**: Registro de operações sensívei
                      DonationsService
                             ↓
                  Valida ONG (existe + verificada)
                             ↓
                      Cria doação no DB
                             ↓
                      Retorna doação criada
```

---

## 🪟 Repositório DoeCerto-Frontend

O Repositório front-end pode ser acssado em:
- **[DoeCerto-Frontend](https://github.com/PauloRC0/DoeCerto-Frontend)** - Repositório front-end
---

## 🗄️ Banco de Dados

### Diagrama ER (Simplificado)

```
┌─────────┐         ┌──────────┐         ┌──────┐
│  User   │◄────┬───│  Donor   │         │ Ong  │
│         │     │   └──────────┘         └──────┘
│ id (PK) │     │         ▲                  ▲
│ email   │     │         │                  │
│ password│     │         │ donorId          │ ongId
│ role    │     │         │                  │
│ Causa**: Banco de dados não está rodando ou credenciais incorretas

**Soluções**:
1. Verifique se o Docker está rodando: `docker ps`
2. Inicie o banco: `docker-compose up -d`
3. Aguarde o healthcheck (~30s): `docker-compose ps`
4. Verifique logs: `docker-compose logs mysql`
5. Confirme credenciais no `.env` com `docker-compose.yml`

### Erro: "Prisma Client not found"

**Causa**: Cliente Prisma não foi gerado após alteração no schema

**Solução**:
```bash
npx prisma generate
```

Se persistir:
```bash
rm -rf node_modules generated
npm install
npx prisma generate
```

### Erro: "Port 3000 already in use"

**Causa**: Outra aplicação usando a porta 3000

**Soluções**:
```bash
# Opção 1: Mudar porta no .env
echo "PORT=3001" >> .env

# Opção 2: Matar processo na porta 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Opção 3: Matar processo (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erro: "JWT malformed" ou "Unauthorized"

**Causa**: Token JWT inválido ou expirado

**Soluções**:
1. Faça login novamente: `POST /auth/login`
2. Verifique se `JWT_SECRET` no `.env` é consistente
3. Limpe cookies do navegador/Postman
4. Confirme que o cookie está sendo enviado nas requisições

### Migrations falhando

**Causa**: Conflito no histórico de migrations ou schema inválido

**Soluções**:
```bash
# Ver status das migrations
npx prisma migrate status

# Opção 1: Reset completo (⚠️ APAGA TODOS OS DADOS)
npx prisma migrate reset

# Opção 2: Criar migration sem aplicar (para revisar)
npx prisma migrate dev --create-only

# Opção 3: Resolver drift manualmente
npx prisma migrate resolve --applied <migration_name>
```

### Erro: "Unique constraint failed"

**Causa**: Tentando criar registro com valor duplicado (email, CPF, CNPJ)

**Solução**:
- Verifique se email/CPF/CNPJ já existe no banco
- Use DTOs de atualização ao invés de criação
- Consulte banco antes de inserir: `npx prisma studio`

### Performance lenta

**Diagnóstico**:
```bash
# Ativar query logging no Prisma
# Adicione no schema.prisma:
# generator client {
#   provider = "prisma-client-js"
#   previewFeatures = ["tracing"]
# }

# Verificar queries lentas nos logs
docker-compose logs -f backend

# Ver queries no Prisma Studio
npx prisma studio
```

**Soluções**:
- ✅ Use paginação em todos os endpoints de listagem
- ✅🌟 Boas Práticas Implementadas

### Código Limpo
- ✅ **Separação de responsabilidades**: Controller → Service → Repository
- ✅ **DRY**: Utilities compartilhadas (ValidationUtil, excludePassword)
- ✅ **Nomenclatura clara**: Nomes descritivos para classes, métodos e variáveis
- ✅ **Tipagem forte**: TypeScript em 100% do código

### Performance
- ✅ **Queries eficientes**: Select específico, prevenção de N+1
- ✅ **Paginação**: Todos os endpoints de listagem
- ✅ **Transações**: Operações multi-tabela atômicas
- ✅ **Índices**: Colunas frequentemente consultadas indexadas

### Manutenibilidade
- ✅ **Modularização**: Features isoladas em módulos
- ✅ **DTOs**: Contratos claros de entrada/saída
- ✅ **Validação centralizada**: Class-validator + custom validators
- ✅ **Erros descritivos**: Exceptions com mensagens claras

### Segurança
- ✅ **Autenticação robusta**: JWT + bcrypt
- ✅ **Autorização granular**: RBAC com Guards
- ✅ **Validação de entrada**: Sanitização automática
- ✅ **Proteção de dados**: Passwords nunca expostos

---

## 📞 Suporte

Para questões e suporte:
- 📧 Email: suporte@doecerto.com
- 🐛 Issues: [GitHub Issues](https://github.com/feliperasilva/DoeCerto-Mobile/issues)
- 📖 Documentação: Veja [API_ENDPOINTS.md](./API_ENDPOINTS.md) para detalhes da API

---

## 🚀 Roadmap

### Próximas Funcionalidades
- [ ] Sistema de notificações (email/push)
- [ ] Dashboard de estatísticas para ONGs
- [ ] Sistema de rating/avaliação de ONGs
- [ ] Chat entre doador e ONG
- [ ] Campanhas de arrecadação com metas
- [ ] Relatórios de impacto social
- [ ] Integração com gateways de pagamento
- [ ] API de webhooks para eventos

### Melhorias Técnicas
- [ ] Rate limiting com Redis
- [ ] Cache de queries com Redis
- [ ] Logs estruturados (Winston/Pino)
- [ ] Monitoramento com Prometheus/Grafana
- [ ] Testes E2E completos
- [ ] CI/CD com GitHub Actions
- [ ] Documentação Swagger/OpenAPI
- [ ] Health checks e métricas

---

<p align="center">
  Desenvolvido com ❤️ usando NestJS
</p>

<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://img.shields.io/badge/NestJS-v11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-v5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  </a>
  <a href="https://www.prisma.io/" target="_blank">
    <img src="https://img.shields.io/badge/Prisma-v6-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
  </a>
  <a href="https://www.mysql.com/" target="_blank">
    <img src="https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  </a>
</p>

### Erro: "Port 3000 already in use"

**Solução**:
1. Altere a porta no `.env`: `PORT=3001`
2. Ou mate o processo: `lsof -ti:3000 | xargs kill`

### Migrations falhando

**Solução**:
```bash
# Reset completo (⚠️ apaga dados)
npx prisma migrate reset

# Ou força nova migration
npx prisma migrate dev --create-only
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrão de Commits

Seguimos o [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

- **Felipe Silva** - [@feliperasilva](https://github.com/feliperasilva)

---

## 📞 Suporte

Para questões e suporte:
- 📧 Email: suporte@doecerto.com
- 🐛 Issues: [GitHub Issues](https://github.com/feliperasilva/DoeCerto-Mobile/issues)

---

<p align="center">
  Desenvolvido com ❤️ usando NestJS
</p>

<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://img.shields.io/badge/NestJS-v11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-v5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  </a>
  <a href="https://www.prisma.io/" target="_blank">
    <img src="https://img.shields.io/badge/Prisma-v6-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
  </a>
  <a href="https://www.mysql.com/" target="_blank">
    <img src="https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  </a>
</p>
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
