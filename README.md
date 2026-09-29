# TaskFlow

TaskFlow is a full-stack project management and team collaboration platform built with React, TypeScript, FastAPI, PostgreSQL, and Docker.

## Product

TaskFlow helps small teams organize projects and work in one place. The application is being developed around real-world full-stack concerns: authentication, authorization, relational data modeling, REST APIs, responsive UI, automated testing, and containerized deployment.

### Core features

- Secure user authentication
- Project creation and ownership
- Project and task management
- Kanban workflow
- Team roles and permissions
- Comments and activity history
- Notifications
- Dashboard analytics
- Search and filtering
- REST API with OpenAPI documentation

## Technology

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query / Router
- Playwright

### Backend
- Python
- FastAPI
- SQLModel
- Pydantic
- PostgreSQL
- JWT authentication
- Pytest

### Infrastructure
- Docker Compose
- Traefik
- GitHub Actions
- Alembic migrations

## Development

Create a local environment file from the example configuration and start the development services:

```bash
cp .env.example .env
docker compose up -d
```

The API documentation is available at:

```
http://localhost:8000/docs
```

Run backend tests with:

```bash
docker compose exec backend pytest
```

Run frontend end-to-end tests with:

```bash
docker compose exec frontend bunx playwright test
```

## Project structure

```
backend/
  app/
    api/
    core/
    alembic/
    models.py
    crud.py

frontend/
  src/
    components/
    routes/
    client/

compose.yml
README.md
```

## Attribution

The initial application infrastructure was based on the open-source [Full Stack FastAPI Template](https://github.com/fastapi/full-stack-fastapi-template) by the FastAPI project.

TaskFlow adds a project-management product domain and is being independently extended with application-specific models, APIs, frontend workflows, tests, and deployment configuration.

## License

MIT
