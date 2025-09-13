
# Lapor OSIS Backend

Node.js Express backend for a school reporting system with MongoDB, JWT authentication, Baileys WhatsApp bot integration, XLS export, file upload/evidence API, and logging.

## Features
- MongoDB integration for storing reports with rich schema (bullying, facility, evidence, contact, tracking code)
- REST API for CRUD, status, assignment, and evidence management
- Optional JWT authentication
- Baileys WhatsApp bot for advanced report commands
- XLS file generator for WhatsApp bot
- File upload and evidence API
- Logging to files

## Getting Started
1. Install dependencies: `npm install`
2. Set up `.env` file
3. Create `/uploads` directory for evidence files
4. Start backend: `npm start`
5. Start bot: `npm run bot`

## API Endpoints
- `POST /reports` — Create report
- `GET /reports` — List/filter reports
- `GET /reports/:id` — Get report
- `PUT /reports/:id` — Update report
- `DELETE /reports/:id` — Delete report
- `POST /reports/:id/assign` — Assign report
- `POST /reports/:id/resolve` — Resolve report
- `POST /api/files/upload/:id` — Upload evidence file (form-data, field: file)
- `GET /api/files/:filename?key=id` — Serve evidence file (id = report id or trackingCode)

## WhatsApp Bot Commands
- `/reports (xls|text) (page)` — List reports (paginated), or export XLS file
- `/search (id|title)` — Search report by tracking code or title
- `/set status (id) (waiting|on process|cancel|finished)` — Set report status
- `/resolve (id)` — Mark report as finished
- `/evidence (id)` — Get evidence file URLs for a report

## Logging
Logs are stored in `/logs` directory.

## Example Report Schema
```
{
	"category": "Bullying/Perundungan",
	"status": "waiting",
	"title": "Bullying verbal di kelas",
	"description": "Saya sering diejek dan dihina oleh teman sekelas",
	"location": "Ruang kelas XI.1",
	"urgency": "tinggi",
	"anonymous": true,
	"hasInjuries": "tidak",
	"bullyingType": "verbal",
	"frequency": "daily",
	"witnesses": "Beberapa teman sekelas melihat kejadian ini",
	"previousReports": "Sudah lapor ke wali kelas tapi tidak ada tindakan",
	"evidenceFiles": [
		{ "name": "bukti_chat.jpg", "size": 2048576, "type": "image/jpeg" },
		{ "name": "video_kejadian.mp4", "size": 15728640, "type": "video/mp4" }
	],
	"trackingCode": "LPR-XYZ789GHI"
}
```

## Notes
- Ensure `/uploads` directory exists for file uploads.
- WhatsApp bot will send XLS file as document for `/reports xls <page>` command.
- Evidence files are accessible via API and WhatsApp bot.
