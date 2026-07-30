# GovHelpDesk - Frontend

[![CI](https://github.com/Mosotho888/Helpdesk_Frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Mosotho888/Helpdesk_Frontend/actions/workflows/ci.yml)
[![CD](https://github.com/Mosotho888/Helpdesk_Frontend/actions/workflows/cd.yml/badge.svg)](https://github.com/Mosotho888/Helpdesk_Frontend/actions/workflows/cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)](https://www.typescriptlang.org)

A full-stack IT helpdesk ticketing system built for a ZA Government Helpdesk use case, with role-based access for Users, Agents, and Admins. This is the React frontend; the [Spring Boot backend](https://github.com/Mosotho888/GovHelp_Desk) lives in a separate repository.

**🔗 Live demo:** https://govhelpdesk.sothoman.com
**📄 Backend API docs:** https://api.sothoman.com/swagger-ui/index.html

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Authentication** - JWT login with silent session restore, logout, and self-service OTP-based password reset
- **Ticket management** - server-side sortable/filterable/paginated queue, detail view, creation, inline status/priority/assignee updates
- **Threaded comments** - nested replies, internal notes (Agent/Admin only), comment types, edit/delete with a 15-minute author window
- **SLA tracking** - response/resolution due dates and breach status, calculated server-side with business-hours logic
- **Attachments** - multipart file upload/download/delete with client-side validation
- **Audit trail** - per-ticket history plus admin reports (auth events, by actor, by action)
- **User and Agent administration** - role management, activation/deactivation, agent availability/department, performance stats
- **Profile settings** - self-service profile editing and password changes

## Screenshots

> _Add screenshots or a short demo GIF here - this is often the first thing a visitor looks at._

| Ticket Queue | Ticket Detail |
|---|---|
| _screenshot_ | _screenshot_ |

## Tech Stack

| Category | Choice |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Server state | TanStack Query |
| Tables | TanStack Table |
| Routing | React Router |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS + shadcn/ui (Base UI, Nova preset) |
| HTTP client | Axios (JWT auth, automatic refresh + retry) |
| Deployment | Docker + Nginx, GitHub Actions CI/CD, OCI ARM VM |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a full technical breakdown, and [docs/frontend/DECISIONS.md](./docs/frontend/DECISIONS.md) for a running log of engineering decisions and bugs found/fixed during development.

## Getting Started

### Prerequisites

- Node.js 20+
- The [GovHelpDesk backend](#https://github.com/Mosotho888/GovHelp_Desk) running locally on `localhost:8080` (or point `.env.development` at a hosted instance)

### Installation

```bash
git clone https://github.com/Mosotho888/Helpdesk_Frontend.git
cd Helpdesk_Frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Environment Variables

See `.env.example` for required variables. `.env.development` and `.env.production` are committed since they contain only public API base URLs, not secrets.

## Docker

```bash
docker build -t govhelpdesk-frontend .
docker run -p 8081:80 govhelpdesk-frontend
```

## CI/CD

Pushes to any branch run lint, type-check, and build. Merges to `main` additionally build and push a multi-arch Docker image, then deploy to production via SSH.

## Contributing

This is a personal portfolio project, not currently accepting external contributions, but feedback and issues are welcome via the [Issues tab](https://github.com/Mosotho888/Helpdesk_Frontend/issues).

## License

Licensed under the [MIT License](./LICENSE).