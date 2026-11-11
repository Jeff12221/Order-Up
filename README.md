# Order-Up

Order-Up has a Vite + React + TypeScript frontend and a Flask + PostgreSQL API. Customer orders are stored in PostgreSQL and the chef dashboard reads them from the API, polling every three seconds. That polling can later be replaced with SSE or WebSockets.

## Local setup

1. Install PostgreSQL and create a database named `order_up`.
2. Copy `.env.example` to `.env`. Set `DATABASE_URL` to your PostgreSQL connection URL, `FRONTEND_ORIGINS` to the frontend origin (Vite defaults to `http://localhost:5173`), and `VITE_API_URL=http://localhost:5000`. Keep `.env` private; it is ignored by Git.
3. Apply the schema and sample data:

   ```sh
   psql "$DATABASE_URL" -f schema.sql
   psql "$DATABASE_URL" -f seed.sql
   ```

   In PowerShell, use `psql $env:DATABASE_URL -f schema.sql` and then `psql $env:DATABASE_URL -f seed.sql` after loading the value into the environment.
4. Install and start the API:

   ```sh
   python -m venv .venv
   # Windows: .venv\Scripts\Activate.ps1
   # macOS/Linux: source .venv/bin/activate
   pip install -r requirements.txt
   python -m flask --app app run --debug
   ```

5. Install the frontend dependencies with `npm install` and run `npm run dev`. The frontend reads its API base URL from `VITE_API_URL`.

## API

- `GET /api/menu` returns available menu items grouped by cuisine.
- `POST /api/orders` accepts `{ "name": "Ari", "table_number": 1, "items": [{"menu_item_id": 1, "quantity": 2, "notes": "No onions"}] }`.
- `GET /api/orders?status=pending,preparing` returns matching orders with customer, table, items, notes, and creation time.
- `PATCH /api/orders/<id>/status` accepts `{ "status": "preparing" }` (also `ready`, `served`, `cancelled`, or `pending`).
- `GET /api/health` checks database connectivity.

The customer start page asks for a customer name and table number (tables 1–10). The customer page loads available menu items from PostgreSQL, then submits the selected dish and side as an order item and note. The API uses SQLAlchemy transactions and validates order payloads. Configure comma-separated allowed browser origins with `FRONTEND_ORIGINS`.

## Render deployment

1. In the Render dashboard, create a PostgreSQL database. Copy its Internal Database URL for a web service in the same Render region; use the External Database URL only for connections outside Render. Set the selected URL as the web service's `DATABASE_URL` environment variable.
2. Connect to the database with `psql "$DATABASE_URL"` (or a PostgreSQL client) and execute `schema.sql`, then `seed.sql`. Do this once per database; the seed can be re-run safely.
3. Create a Render Web Service from this repository. Set the build command to `pip install -r requirements.txt` and the start command to `gunicorn app:app`. Set `DATABASE_URL` and `FRONTEND_ORIGINS` in the service's environment settings.
4. Keep the frontend as a static site, publish the Vite build output (`dist`), and configure `VITE_API_URL` to the deployed backend URL at build time. Add the static site's origin to `FRONTEND_ORIGINS`, then rebuild the frontend.

## Assumptions

- Each POST creates one order for one customer at one table. A customer's multiple dishes are represented as order items.
- The requested schema has no category or side-choice columns. Categories and side choices are retained from the existing frontend's menu metadata; the selected side is stored in the order item's `notes` field. Prices, descriptions, cuisine, and availability come from the database.
- There is no receptionist page. Staff authentication remains the existing frontend demo PIN (`1234`); API authorization is not included in the requested endpoints.
