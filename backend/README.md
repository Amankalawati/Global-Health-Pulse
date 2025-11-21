# GHP Backend (minimal)

This is a small Node/Express backend used for local development. It provides simple auth endpoints backed by a JSON file.

Endpoints:
- POST /api/register  { name, email, password }
- POST /api/login     { email, password }

Run locally:

```bash
cd backend
npm install
npm run dev   # requires nodemon; or `npm start` to run once
```

The server listens on port 4000 by default. The frontend dev server (Vite) usually runs on `http://localhost:5175`; CORS is enabled for that origin.

Data storage:
- `data/users.json` is used to store registered users. Passwords are hashed using `bcryptjs`.

Notes:
- This is intended for local development only. For production use a proper database, secure session or JWT-based auth, input validation, rate-limiting, and better error handling.

API Ninjas (optional live COVID data)
-----------------------------------
This backend can proxy global COVID-19 data from API Ninjas when you set an API key in your environment.

1) Create a `.env` file in the `backend` folder with:

```
API_NINJAS_KEY=your_api_ninjas_key_here
```

2) Start the backend (PowerShell):

```powershell
cd backend; npm install; npm run dev
```

When `API_NINJAS_KEY` is set the endpoint `GET /api/external/covid/global` will proxy to the API Ninjas COVID endpoint and return live data. If the key is not set, the endpoint returns mocked sample data.

Security note: Do not commit `.env` to source control. Store secrets securely and rotate keys if compromised.
