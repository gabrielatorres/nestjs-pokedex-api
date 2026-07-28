<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Pokedex API</h1>

<p align="center">
  A RESTful API built with <a href="https://nestjs.com/">NestJS</a> and <a href="https://www.mongodb.com/">MongoDB</a> that manages a Pokemon catalog, including data seeding from the <a href="https://pokeapi.co/">PokeAPI</a>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white" alt="Docker" />
</p>

## Overview

This project is a practice API that implements a full CRUD for Pokemon resources on top of NestJS and MongoDB, following the framework's modular architecture. It demonstrates common backend patterns such as DTO validation, custom pipes, environment-based configuration, the adapter pattern for external HTTP calls, and containerized deployments for both development and production.

## Features

- **CRUD for Pokemon**: create, list (with pagination), retrieve, update and delete resources.
- **Data validation**: global `ValidationPipe` with whitelisting and automatic type transformation via `class-validator` / `class-transformer`.
- **Pagination**: configurable `limit` and `offset` query parameters with a sensible default.
- **Custom pipe**: `ParseMongoIdPipe` to validate MongoDB ObjectIds on route parameters.
- **Database seeding**: a `/api/seed` endpoint that fetches the first generation of Pokemon from the [PokeAPI](https://pokeapi.co/) and populates the database.
- **Adapter pattern**: an `AxiosAdapter` decoupling the HTTP client implementation from the services that consume it.
- **Environment-based configuration**: managed with `@nestjs/config` and validated at startup with Joi.
- **Containerization**: separate Docker Compose setups for local development and production.

## Tech Stack

| Layer          | Technology                          |
| -------------- | ------------------------------------ |
| Framework      | [NestJS](https://nestjs.com/) 11    |
| Language       | TypeScript                          |
| Database       | MongoDB + Mongoose                  |
| Validation     | class-validator, class-transformer, Joi |
| HTTP Client    | Axios (via a custom adapter)        |
| Testing        | Jest                                |
| Containerization | Docker & Docker Compose           |

## Project Structure

```
src/
├── common/          # Shared adapters, DTOs and pipes
├── config/          # Environment variables and Joi validation schema
├── pokemon/         # Pokemon module: controller, service, DTOs, entity
├── seed/            # Seed module: populates the database from the PokeAPI
├── app.module.ts
└── main.ts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) and Docker Compose
- [Nest CLI](https://docs.nestjs.com/cli/overview) (optional, for local development)
  ```bash
  npm i -g @nestjs/cli
  ```

### 1. Clone the repository and install dependencies

```bash
git clone <repository-url>
cd pokedex
yarn install
```

### 2. Configure environment variables

Copy the template file and fill in the values:

```bash
cp .env.template .env
```

| Variable              | Description                          |
| ---------------------- | ------------------------------------- |
| `MONGO_DB_CONNECTION`  | MongoDB connection string             |
| `PORT`                 | Port the API will run on              |
| `DEFAULT_LIMIT`        | Default page size for pagination      |

### 3. Start the database

```bash
docker-compose up -d
```

### 4. Run the app in development mode

```bash
yarn start:dev
```

### 5. Seed the database

With the app running, hit the seed endpoint to populate MongoDB with Pokemon data:

```
GET http://localhost:3000/api/seed
```

## API Endpoints

All routes are prefixed with `/api`.

| Method  | Endpoint         | Description                          |
| ------- | ---------------- | ------------------------------------- |
| `GET`   | `/seed`           | Fetches and stores Pokemon from the PokeAPI |
| `GET`   | `/pokemon`        | Lists Pokemon (supports `limit` and `offset` query params) |
| `GET`   | `/pokemon/:id`    | Retrieves a single Pokemon            |
| `POST`  | `/pokemon`        | Creates a new Pokemon                 |
| `PATCH` | `/pokemon/:id`    | Updates an existing Pokemon           |
| `DELETE`| `/pokemon/:id`    | Deletes a Pokemon                     |

## Testing

```bash
yarn test        # unit tests
yarn test:e2e     # end-to-end tests
yarn test:cov     # coverage report
```

## Production Deployment

1. Create a `.env.prod` file with the production environment variables.
2. Build and start the containers:
   ```bash
   docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
   ```
3. Once the image is built, subsequent runs can start the container in detached mode:
   ```bash
   docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
   ```

## License

This project is unlicensed and was built for learning/practice purposes.
