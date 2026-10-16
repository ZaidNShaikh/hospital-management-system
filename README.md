# Harbor Health — Hospital Management System

A small React and Express hospital management app backed by PostgreSQL. It includes an Admin and Doctor sign-in, database-backed dashboard counts, and patient, doctor, and appointment management. Express serves the Vite build in production.

## Requirements

- Node.js 20 or newer
- PostgreSQL 14 or newer

## Run locally

1. Create a PostgreSQL database named `harbor_hospital`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` (or the `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` values).
3. Run `npm install` and `npm run dev`.
4. Open the Vite URL printed in the terminal (usually `http://localhost:5173`). The API runs on port 3000.

The server applies `server/schema.sql` at startup. It creates only the three application tables: `patients`, `doctors`, and `appointments`. To populate a clean database with a few sample records, set `SEED_SAMPLE_DATA=true` before starting the server. Seeding is idempotent and never changes dashboard counts, which are queried from PostgreSQL.

Demo sign-ins (change the passwords in `.env` for any shared environment):

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `admin123` |
| Doctor | `doctor` | `doctor123` |

Admin can create, edit, and delete patient and doctor records, and book, edit, or cancel appointments. Doctor can view the dashboard and records. A patient or doctor referenced by an appointment cannot be deleted, because canceled appointments remain in the database for history. Cancelling an appointment changes its status to `Cancelled`.

## Verify

```sh
npm run check
```

`/api/health` returns the service and database connection status. For example, `curl http://localhost:3000/api/health`.

## Deploy to Render

1. Push this repository to GitHub or another Git provider connected to Render.
2. In Render, create a Blueprint from the repository. `render.yaml` creates the PostgreSQL database and Node web service, builds the frontend, and connects the service to the database. The example uses Render's free Postgres tier for a no-cost demo; Render currently expires free databases after 30 days. Upgrade the database to a paid plan for ongoing use and data retention.
3. Set `ADMIN_PASSWORD` and `DOCTOR_PASSWORD` in the web service environment before sharing access. Render generates `JWT_SECRET` and configures PostgreSQL SSL.
4. Wait for the deploy to finish. Check `https://<your-service>.onrender.com/api/health`, then open the service URL and sign in.

The web service runs `npm install && npm run build` and `npm start`. The server listens on `process.env.PORT`, uses `DATABASE_URL`, applies the schema on startup, and serves `dist/` in production. Do not commit `.env` or use the demo passwords on a public deployment.
