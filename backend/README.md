# UAT Backend

This is the backend API for the UAT (User Acceptance Testing) project.

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── app.config.ts # Application configuration
│   └── db.config.ts  # Database configuration
├── controllers/      # Request handlers
│   └── user.controller.ts
├── middlewares/      # Middleware functions
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── models/           # Data models
│   ├── payment.model.ts
│   └── user.model.ts
├── routes/           # API routes
│   └── user.route.ts
├── schemas/          # Validation schemas
│   └── user.schema.ts
├── services/         # Business logic
│   └── user.service.ts
├── types/            # TypeScript type definitions
│   ├── address.type.ts
│   ├── fastify.type.ts
│   ├── index.ts
│   ├── paymentmethod.type.ts
│   └── user.type.ts
├── utils/            # Utility functions
│   └── common.utils.ts
├── app.ts            # Fastify app setup
└── server.ts         # Server startup
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Copy `.env.example` to `.env` and update the values
4. Generate Prisma client:
   ```
   pnpm schema
   ```

### Development

Start the development server:

```
pnpm dev
```

The API will be available at http://localhost:3000.

API documentation is available at http://localhost:3000/docs.

### Building for Production

Build the project:

```
pnpm build
```

Start the production server:

```
pnpm start
```

## API Endpoints

### User Routes

- `GET /api/user` - Test user route
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login
- `GET /api/user/all` - Get all users (admin)
- `GET /api/user/:id` - Get specific user by ID (admin)
- `PUT /api/user/:id` - Update user by ID
- `DELETE /api/user/:id` - Delete user by ID
- `GET /api/user/profile` - Get current user profile (requires auth)

## Technologies

- [Fastify](https://www.fastify.io/) - Web framework
- [Prisma](https://www.prisma.io/) - ORM
- [Zod](https://zod.dev/) - Schema validation
- [TypeScript](https://www.typescriptlang.org/) - Programming language