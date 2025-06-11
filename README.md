# UAT Project

This project consists of a React Native frontend and a Fastify backend.

## Project Structure

- `frontend/`: React Native application built with Expo
  - User interface for car rental, booking, chat, and profile management
  - Supports multiple languages (English and Portuguese)
  - Includes both user and admin interfaces
- `backend/`: Fastify API server with TypeScript
  - RESTful API endpoints for all application features
  - Uses Prisma ORM for database operations
  - JWT-based authentication system

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager (preferred) / npm 
- MongoDB (for the backend database)
- Prisma CLI (installed as a project dependency)

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

**Important for physical devices:** You need to update the `PHYSICAL_DEVICE_API_URL` in `frontend/src/config/api.config.ts` with your computer's local IP address.

1. Find your local IP address by running:

```bash
pnpm run get-ip
```

2. Update the `frontend/src/config/api.config.ts` file with your IP address:

```ts
// Base URLs for different environments
const DEV_API_URL = 'http://10.0.2.2:3000/api'; // Android emulator
const IOS_DEV_API_URL = 'http://localhost:3000/api'; // iOS simulator
const DEVICE_API_URL = 'http://YOUR_IP_ADDRESS:3000/api'; // Physical device !!!
const WEB_DEV_API_URL = 'http://localhost:3000/api'; // Web browser
const PROD_API_URL = 'https://your-production-api.com/api'; // Production
```

Replace `YOUR_IP_ADDRESS` with your actual IP address (e.g., 192.168.1.5).

This will display all your network interfaces and their IP addresses. Use the IP address of the network interface that's connected to the same network as your mobile device.
    
Alternatively, you can find your IP address manually:
- On Windows: Open Command Prompt and type `ipconfig`
- On macOS: Open System Preferences > Network or type `ipconfig` in Terminal
- On Linux: Open Terminal and type `ip addr show` or `ipconfig`

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

## Database Setup

The project uses Prisma ORM to interact with MongoDB. After installing dependencies, you need to generate the Prisma client:

```bash
cd backend
pnpm prisma generate
```

## Admin Setup

To create an admin user, run the following script:

```bash
cd backend
pnpm run set-admin
```

This will prompt you to enter an email address for the admin user. If the user exists, it will be promoted to admin; if not, you'll be asked to create a new admin user.

## Internationalization

The application supports multiple languages:
- English (default)
- Portuguese

Users can change their language preference in the profile settings. Developers can add translations by modifying the JSON files in the `frontend/src/i18n` directory.

## Features

- User authentication (login, register, profile)
- Car rental management
- Booking system
- Real-time chat functionality
- Notification system
- Multi-language support (English and Portuguese)
- Theme customization
- Admin dashboard for car management

## Chat System

The application includes a real-time chat system that allows users to:
- Communicate with support staff
- Discuss rental details
- Receive important notifications

## Notification System

The app includes a notification system that alerts users about:
- New messages
- Booking status changes
- Upcoming reservations
- Payment confirmations

## Admin Dashboard

The admin dashboard provides management capabilities:
- Car inventory management (add, edit, delete cars)
- User management
- Reservation oversight
- Support chat access

## Theme Support

The application supports light and dark themes, which can be toggled in the user profile settings.