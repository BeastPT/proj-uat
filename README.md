# UAT Project

This project consists of a React Native frontend and a Fastify backend.

## Project Structure

- `frontend/`: React Native application built with Expo
- `backend/`: Fastify API server with TypeScript

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- MongoDB (for the backend database)

## Getting Started

### Installation

1. Install dependencies for the entire project:

```bash
pnpm run install:all
```

This will install dependencies for the root project, backend, and frontend.

### Configuration

1. Configure the backend:

The backend requires a `.env` file with the following variables:

```
# Database
DATABASE_URL="mongodb://username:password@localhost:27017/uat-db?authSource=admin"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:19000,http://localhost:19006,exp://localhost:19000,exp://localhost:19006"

# JWT (for authentication)
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="1d"
REFRESH_TOKEN_SECRET="your-refresh-secret-key-here"
REFRESH_TOKEN_EXPIRES_IN="7d"
```

Make sure to update the `DATABASE_URL` with your MongoDB connection string and set secure values for `JWT_SECRET` and `REFRESH_TOKEN_SECRET`.

2. Configure the frontend:

The frontend API service is configured to connect to the backend at:
- `http://10.0.2.2:3000/api` for Android emulators
- `http://localhost:3000/api` for iOS simulators
- `http://YOUR_COMPUTER_IP:3000/api` for physical devices

**Important for physical devices:** You need to update the `PHYSICAL_DEVICE_API_URL` in `frontend/.env` with your computer's local IP address.

1. Find your local IP address by running:

```bash
pnpm run get-ip
```

2. Update the `frontend/.env` file with your IP address:

```
# API URLs
API_URL=http://localhost:3000/api
ANDROID_API_URL=http://10.0.2.2:3000/api
IOS_API_URL=http://localhost:3000/api
PHYSICAL_DEVICE_API_URL=http://YOUR_IP_ADDRESS:3000/api
```

Replace `YOUR_IP_ADDRESS` with your actual IP address (e.g., 192.168.1.5).

This will display all your network interfaces and their IP addresses. Use the IP address of the network interface that's connected to the same network as your mobile device.

Alternatively, you can find your IP address manually:
- On Windows: Open Command Prompt and type `ipconfig`
- On macOS: Open System Preferences > Network or type `ifconfig` in Terminal
- On Linux: Open Terminal and type `ip addr show` or `ifconfig`

### Running the Application

To run both the frontend and backend concurrently:

```bash
pnpm run dev
```

To run them separately:

- Backend only:
```bash
pnpm run start:backend
```

- Frontend only:
```bash
pnpm run start:frontend
```

## API Documentation

The backend API documentation is available at `http://localhost:3000/docs` when the backend server is running.

## Authentication

The application uses JWT-based authentication. When a user logs in or registers, the backend provides an access token and a refresh token. The access token is used for API requests and the refresh token is used to obtain a new access token when the current one expires.

## Features

- User authentication (login, register, profile)
- Car rental management
- Booking system