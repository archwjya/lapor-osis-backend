# Lapor OSIS Backend

Node.js Express backend for a school reporting system with MongoDB, JWT authentication, Baileys WhatsApp bot integration, and logging.

## Features
- MongoDB integration for storing reports
- REST API for CRUD and investigator/teacher actions
- Optional JWT authentication
- Baileys WhatsApp bot for report commands
- Configurable dynamic questions
- Logging to files

## Getting Started
1. Install dependencies: `npm install`
2. Set up `.env` file
3. Start backend: `npm start`
4. Start bot: `npm run bot`

## API Endpoints
- `POST /reports` — Create report
- `GET /reports` — List/filter reports
- `GET /reports/:id` — Get report
- `PUT /reports/:id` — Update report
- `DELETE /reports/:id` — Delete report
- `POST /reports/:id/assign` — Assign report
- `POST /reports/:id/resolve` — Resolve report

## Bot Commands
- `/reports` — List reports
- `/report <id>` — View report
- `/assign <id> <teacher>` — Assign report
- `/resolve <id>` — Resolve report

## Logging
Logs are stored in `/logs` directory.
