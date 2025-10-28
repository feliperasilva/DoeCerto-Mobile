# DoeCerto-Mobile

DoeCerto-Mobile é o repositório central do projeto DoeCerto, que irá reunir tanto o backend (API REST desenvolvida em NestJS, utilizando Prisma ORM e MySQL) quanto futuramente o frontend do aplicativo DoeCerto. O objetivo do projeto é facilitar o gerenciamento de doações e campanhas sociais, oferecendo soluções completas para aplicações mobile e web.

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Execução do Backend](#execução-do-backend)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação da API](#documentação-da-api)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Sobre o Projeto

O DoeCerto-Mobile reúne diferentes componentes do projeto DoeCerto, incluindo o backend e, futuramente, o frontend. O backend é responsável por fornecer uma API robusta para o gerenciamento de doações, beneficiários, campanhas e usuários. O projeto foi desenvolvido com foco em escalabilidade, segurança e facilidade de manutenção.

> **Nota:** Este README foca principalmente na configuração e execução do backend. Quando o frontend for adicionado, este documento será atualizado para incluir as instruções correspondentes.

## Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) — Framework Node.js para construção de APIs escaláveis.
- [Prisma ORM](https://www.prisma.io/) — ORM moderno para banco de dados.
- [TypeScript](https://www.typescriptlang.org/) — Linguagem principal.
- [MySQL](https://www.mysql.com/) — Banco de dados relacional.
- [Docker](https://www.docker.com/) — Ambiente de desenvolvimento e execução do banco de dados.
- **Futuramente:** Frameworks para o frontend do aplicativo.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado v18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

## Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/feliperasilva/DoeCerto-Mobile.git
   cd DoeCerto-Mobile
   ```

2. **Instale as dependências do backend**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Copie o arquivo de variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   > Edite o arquivo `.env` conforme necessário para seu ambiente local.

## Execução do Backend

### 1. Subindo o banco de dados MySQL com Docker Compose

O projeto possui um arquivo `docker-compose.yml` para facilitar a inicialização do banco de dados MySQL:

```bash
docker-compose up -d
```
> Isso criará um container MySQL conforme especificado no arquivo `docker-compose.yml`.

### 2. Rodando as migrações do Prisma

Com o banco de dados em funcionamento, execute as migrações para criar as tabelas necessárias:

```bash
npx prisma migrate dev
```

### 3. Inicializando o servidor NestJS

```bash
npm run start:dev
# ou
yarn start:dev
```

A API estará disponível em `http://localhost:3000` (por padrão).

## Estrutura do Projeto

```
DoeCerto-Mobile/
├── src/
│   ├── modules/      # Módulos do backend (usuários, campanhas, doações, etc)
│   ├── prisma/       # Configuração do Prisma ORM
│   └── main.ts       # Entry point da aplicação backend
├── docker-compose.yml
├── .env.example
├── package.json
├── README.md
└── [frontend/]       # Pasta do frontend (em breve)
```

## Documentação da API

A documentação dos endpoints pode ser acessada via Swagger em `http://localhost:3000/api` após iniciar o projeto.

## Contribuição

1. Fork este repositório
2. Crie uma branch com sua feature: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'Minha nova feature'`
4. Push para o branch: `git push origin minha-feature`
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.

---

**Dúvidas ou sugestões?** Abra uma issue ou entre em contato!
