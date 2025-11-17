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
  <a href="#%EF%B8%8F-arquitetura">Arquitetura</a>
</p>

---

## 📋 Sobre

O **DoeCerto Backend** é uma API RESTful desenvolvida com NestJS que gerencia doações entre doadores e ONGs. A plataforma permite:

- ✅ Registro e autenticação de doadores e ONGs
- ✅ Criação de doações materiais e monetárias
- ✅ Gerenciamento de status de doações (pendente, concluída, cancelada)
- ✅ Sistema de verificação de ONGs
- ✅ Controle de acesso baseado em roles (RBAC)
- ✅ Histórico completo de transações

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

#### Autenticação
- `POST /auth/login` - Login
- `POST /auth/register/donor` - Registrar doador
- `POST /auth/register/ong` - Registrar ONG
- `POST /auth/logout` - Logout

#### Doações
- `POST /donations` - Criar doação (apenas doadores)
- `GET /donations` - Listar todas as doações
- `GET /donations/sent` - Doações enviadas (doador)
- `GET /donations/received` - Doações recebidas (ONG)
- `PATCH /donations/:id` - Atualizar doação
- `DELETE /donations/:id` - Cancelar doação

#### ONGs
- `GET /ongs` - Listar ONGs (público)
- `GET /ongs/:id` - Ver perfil da ONG (público)
- `PATCH /ongs/:id` - Atualizar perfil (própria ONG)

#### Doadores
- `GET /donors` - Listar doadores (admin)
- `GET /donors/:id` - Ver perfil
- `PATCH /donors/:id` - Atualizar perfil (próprio doador)

### Testando a API

#### Com cURL:

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "senha123"}' \
  -c cookies.txt

# Criar doação
curl -X POST http://localhost:3000/donations \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "ongId": 1,
    "donationType": "material",
    "materialDescription": "10 pacotes de arroz",
    "materialQuantity": 10
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
                                Valida JWT
                                      ↓
                               Injeta @CurrentUser
                                      ↓
                                 Controller
```

### Fluxo de Doação

```
Donor → POST /donations → JwtAuthGuard
                             ↓
                        RolesGuard (donor)
                             ↓
                      DonationsController
                             ↓
                      DonationsService
                             ↓
                  Valida ONG (existe + verificada)
                             ↓
                      Cria doação no DB
                             ↓
                      Retorna doação criada
```

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
│ name    │     │   ┌──────────────┐         │
└─────────┘     └───│  Donation    │─────────┘
                    │              │
                    │ id (PK)      │
                    │ donorId (FK) │
                    │ ongId (FK)   │
                    │ donationType │
                    │ status       │
                    │ amount       │
                    └──────────────┘
```

### Principais Tabelas

- **User**: Usuários base (donors, ongs, admins)
- **Donor**: Perfil de doadores (CPF)
- **Ong**: Perfil de ONGs (CNPJ, isVerified)
- **Donation**: Doações (material ou monetária)

### Executar Prisma Studio

Para visualizar e editar dados no banco:

```bash
npx prisma studio
```

Acesse: `http://localhost:5555`

---

## 🔒 Segurança

### Implementações de Segurança

- ✅ **Passwords**: Hash com bcrypt (10 rounds)
- ✅ **JWT**: Tokens com expiração de 24h
- ✅ **Cookies**: httpOnly, secure (prod), sameSite: strict
- ✅ **CORS**: Configurado para frontend específico
- ✅ **Validação**: DTOs com class-validator
- ✅ **RBAC**: Guards de roles (admin, donor, ong)
- ✅ **SQL Injection**: Prisma ORM com prepared statements

### Variáveis Sensíveis

⚠️ Nunca versione:
- `.env` - Variáveis de ambiente
- `node_modules/` - Dependências
- `dist/` - Build de produção

---

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

---

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run start` | Inicia em modo normal |
| `npm run start:dev` | Inicia em modo watch (desenvolvimento) |
| `npm run start:prod` | Inicia em modo produção |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm run format` | Formata código com Prettier |
| `npm run lint` | Executa ESLint e corrige |
| `npm run test` | Executa testes |
| `npx prisma migrate dev` | Cria e aplica migration |
| `npx prisma studio` | Abre interface visual do banco |
| `npx prisma generate` | Gera Prisma Client |

---

## 🐛 Troubleshooting

### Erro: "Can't connect to MySQL server"

**Solução**:
1. Verifique se o Docker está rodando: `docker ps`
2. Inicie o banco: `docker-compose up -d`
3. Aguarde o healthcheck: `docker-compose ps`

### Erro: "Prisma Client not found"

**Solução**:
```bash
npx prisma generate
```

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
