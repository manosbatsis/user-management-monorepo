# user-management-monorepo

## Prerequisites

- Node 20.x
- NPM 10.x
- PNPM 8.9.0
- Docker Compose

## Configuration

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
> Test results are also published in Github Actions and Pull Requests
