# Backend — NestJS (TypeScript)

Tech stack summary:

- NestJS
- Mongoose (MongoDB)
- JWT for authentication

Quick start:

1. Create a `.env` from `.env.example` and set `MONGO_URI` and `JWT_SECRET`.

2. Install and run locally:

```
cd backend
npm install
npm run start:dev
```

APIs:

- `POST /auth/register` { email, password, name } -> { access_token }
- `POST /auth/login` { email, password } -> { access_token }

Notes:

- Modules for packages/bookings are scaffolded with schemas. Add controllers/services to implement full CRUD and admin guards.

- Swagger docs available at `/api/docs` when the server is running (shows bearer auth for JWT).
