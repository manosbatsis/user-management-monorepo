<h1>User Management Monorepo</h1>

[![CI](https://github.com/manosbatsis/user-management-monorepo/actions/workflows/ci.yml/badge.svg)](https://github.com/manosbatsis/user-management-monorepo/actions/workflows/ci.yml)

A sample to play around with [pnpM](https://pnpm.io/) (and eventually [Turborepo](https://turbo.build/)) monorepos, 
[Prisma](https://www.prisma.io/) with [NestJS](https://nestjs.com/) and [Next.js](https://nextjs.org/) 
with [Refine](https://refine.dev/).

<!-- TOC -->
  * [Prerequisites](#prerequisites)
  * [Configuration](#configuration)
    * [Installation](#installation-)
    * [Server](#server)
    * [Database](#database)
      * [With Local Postgres](#with-local-postgres)
      * [With Docker Compose](#with-docker-compose)
    * [Database Schema](#database-schema)
  * [Run Tests](#run-tests)
  * [Run Apps](#run-apps)
    * [Start the Server](#start-the-server)
    * [Start the Client](#start-the-client)
    * [Login](#login)
<!-- TOC -->

## Prerequisites

- Node v20.x
- npm v10.x
- pnpM v8.9.0
- Docker Compose

## Configuration

### Installation 

Start by installing:

```bash
pnpm install
```

### Server

Copy the `src/assets/config-template.json` file as `src/assets/config.json`

```bash
cp packages/api/src/assets/config-template.json packages/api/src/assets/config.json
```

Feel free to edit settings in _config.json_ according to your environment requirements.


### Database

#### With Local Postgres

If you have a local postgres DB, copy the `packages/api/.env.template-local` file as `packages/api/.env`

```bash
cp packages/api/.env.template-local packages/api/.env
```

> [!IMPORTANT]  
> Feel free to edit settings to match your environment requirements.

#### With Docker Compose

To use docker compose for a postgres DB, copy the `packages/api/.env.template-compose` file as `packages/api/.env`

```bash
cp packages/api/.env.template-compose packages/api/.env
```

then launch with


```bash
docker-compose up
```

### Database Schema

Push the database schema with 

```bash
pnpm run db:push
```

then seed with sample data:

```bash
pnpm run db:seed
```

## Run Tests

To run **unit** tests in all workspaces:

```bash
pnpm run test
```

To run **e2e** tests in all workspaces:

```bash
pnpm run test:e2e
```

HTML test reports for your browser are published in _packages/*/output_.

> [!TIP]
> Test results are also published as the build summary in Github Actions and a comment in Pull Requests.


## Run Apps

### Start the Server

```bash
pnpm run server
```

### Start the Client

```bash
pnpm run client
```

### Login

Browse http://localhost:3001 and login with:

- username: admin@test.com
- password: Test123!


