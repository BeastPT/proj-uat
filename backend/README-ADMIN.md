## 1. Using the Admin Script

You can use the provided script to set any existing user as an admin:

```bash
cd backend
npx ts-node src/scripts/set-admin.ts admin@example.com
```

Replace `admin@example.com` with the email of the user you want to make an admin.

## 2. Using the Admin API Endpoints

If you already have an admin user, you can use the API to set other users as admins:

```
PUT /api/user/:id/set-admin
```

This endpoint requires admin authentication (the requesting user must already be an admin).

To remove admin privileges:

```
PUT /api/user/:id/remove-admin
```