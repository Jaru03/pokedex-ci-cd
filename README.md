# Pokedex CI/CD

A Next.js Pokedex app built as a hands-on practice project for CI/CD with GitHub Actions, Docker, and VPS deployment.

## Purpose

This project is not focused on the app itself — it exists to practice a real-world deployment pipeline:

- **CI with GitHub Actions** — automated lint, typecheck, test, and build on every push to `main`
- **Docker** — multi-stage image build published to GitHub Container Registry (GHCR)
- **CD to a VPS** — SSH-based deployment that pulls the latest image and restarts the container via Docker Compose

## Pipeline

```
push to main
    │
    ├── lint
    ├── test
    └── typecheck
          │
          └── build
                │
                └── docker build & push → ghcr.io/jaru03/pokedex-ci-cd
                          │
                          └── SSH into VPS → docker compose pull && up -d
```

Each stage depends on the previous one. If lint, tests, or typecheck fail, the image is never built and the deploy never runs.

## Tech stack

| Layer       | Tool                          |
|-------------|-------------------------------|
| Framework   | Next.js 16 (App Router)       |
| Language    | TypeScript                    |
| Styling     | Tailwind CSS v4               |
| Package mgr | pnpm 11                       |
| Testing     | Jest                          |
| Container   | Docker (multi-stage, Alpine)  |
| Registry    | GitHub Container Registry     |
| CI/CD       | GitHub Actions                |
| Hosting     | VPS via SSH + Docker Compose  |
| Data        | [PokéAPI](https://pokeapi.co) |

## Docker image

The Dockerfile uses three stages to keep the final image small:

1. **deps** — installs dependencies with `pnpm install --frozen-lockfile`
2. **builder** — runs `pnpm build` to produce the Next.js standalone output
3. **runner** — copies only the standalone build, static assets, and public files; runs as a non-root user

## GitHub Actions secrets required

| Secret            | Description                               |
|-------------------|-------------------------------------------|
| `SSH_HOST`        | VPS IP or hostname                        |
| `SSH_USER`        | SSH username                              |
| `SSH_PRIVATE_KEY` | Private key for SSH access                |
| `GHCR_TOKEN`      | GitHub token to pull from GHCR on the VPS |

## Local development

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint
pnpm typecheck
pnpm test
```

## Running with Docker locally

```bash
docker build -t pokedex .
docker run -p 3000:3000 pokedex
```
