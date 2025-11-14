# DBX Aviation Analytics Platform

![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?style=flat&logo=tailwindcss&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-5.83-ff4154?style=flat&logo=reactquery&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

A modern, production-ready aviation analytics platform with AI-powered flight analysis, real-time monitoring, and role-based access control.

## 🚀 Live Demo

- **Frontend:** [Deploy to Vercel/Netlify]
- **Backend API:** https://dbx-system-production.up.railway.app
- **GitHub:** https://github.com/dream1290/dbx-ui

## ✨ Features

- 🛩️ **Flight Analysis** - AI-powered anomaly detection and performance insights
- 📊 **Real-time Dashboard** - Live metrics and system monitoring
- ✈️ **Fleet Management** - Complete aircraft lifecycle management
- 📈 **Advanced Reports** - Generate and export comprehensive analytics
- 👥 **User Management** - Role-based access control with 5 user roles
- 🔐 **Secure Authentication** - JWT with automatic token refresh
- 📱 **Mobile Responsive** - Optimized for all devices
- 🎨 **Modern UI** - Built with Shadcn/ui and Tailwind CSS

## Project info

**Repository**: https://github.com/dream1290/dbx-ui
**Author**: [@dream1290](https://github.com/dream1290)

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b07ab2d7-8073-4b32-aada-3faca79e1b62) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- TanStack Query (React Query) - Data fetching and caching
- React Router - Client-side routing

## API Integration

This application integrates with a backend API for all data operations. The frontend uses React Query for efficient data fetching, caching, and state management.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Development
VITE_API_URL=http://localhost:8000

# Production
VITE_API_URL=https://dbx-system-production.up.railway.app
```

- `VITE_API_URL`: The base URL of your backend API
  - Development: `http://localhost:8000`
  - Production: `https://dbx-system-production.up.railway.app`

### API Requirements

The backend API should implement the following endpoints:

#### Authentication
- `POST /api/v2/auth/login` - User login
- `POST /api/v2/auth/register` - User registration
- `POST /api/v2/auth/logout` - User logout
- `POST /api/v2/auth/refresh` - Refresh access token
- `GET /api/v2/auth/profile` - Get user profile
- `PUT /api/v2/auth/profile` - Update user profile

#### Flight Analysis
- `GET /api/v2/analyses` - List all flight analyses
- `GET /api/v2/analyses/:id` - Get single flight analysis
- `POST /api/v2/analyze` - Upload and analyze flight log
- `DELETE /api/v2/analyses/:id` - Delete flight analysis
- `GET /api/v2/analyses/export?format=csv|json` - Export analyses

#### Aircraft Management
- `GET /api/v2/aircraft` - List all aircraft
- `GET /api/v2/aircraft/:id` - Get single aircraft
- `POST /api/v2/aircraft` - Create aircraft
- `PUT /api/v2/aircraft/:id` - Update aircraft
- `DELETE /api/v2/aircraft/:id` - Delete aircraft
- `GET /api/v2/aircraft-types` - Get aircraft types

#### User Management
- `GET /api/v2/users` - List all users
- `GET /api/v2/users/:id` - Get single user
- `POST /api/v2/users` - Create user
- `PUT /api/v2/users/:id` - Update user
- `DELETE /api/v2/users/:id` - Delete user
- `GET /api/v2/users/activity?limit=10` - Get user activity log

#### Organizations
- `GET /api/v2/organizations` - List all organizations
- `GET /api/v2/organizations/:id` - Get single organization
- `POST /api/v2/organizations` - Create organization
- `PUT /api/v2/organizations/:id` - Update organization
- `DELETE /api/v2/organizations/:id` - Delete organization

#### Reports
- `GET /api/v2/reports` - List all reports
- `GET /api/v2/reports/:id` - Get single report
- `POST /api/v2/reports` - Generate report
- `GET /api/v2/reports/:id/pdf` - Export report as PDF
- `GET /api/v2/reports/:id/csv` - Export report as CSV
- `DELETE /api/v2/reports/:id` - Delete report

#### System
- `GET /api/v2/system/status` - Get system status
- `GET /api/v2/system/metrics` - Get system metrics
- `GET /api/v2/system/health-detailed` - Get detailed health
- `GET /api/v2/system/logs` - Get system logs
- `GET /api/v2/system/settings` - Get system settings
- `PUT /api/v2/system/settings` - Update system settings

#### Notifications
- `GET /api/v2/notifications` - List all notifications
- `PUT /api/v2/notifications/:id/read` - Mark notification as read
- `DELETE /api/v2/notifications/:id` - Delete notification
- `POST /api/v2/notifications/mark-all-read` - Mark all as read

### Authentication

The application uses JWT-based authentication with automatic token refresh:

1. **Access Token**: Stored in localStorage as `auth_token`
2. **Refresh Token**: Stored in localStorage as `refresh_token`
3. **Auto-Refresh**: Tokens are automatically refreshed when they expire
4. **Logout on Failure**: Users are logged out if token refresh fails

All API requests include the access token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

### Data Caching Strategy

The application uses React Query with the following caching configuration:

- **Stale Time**: 30 seconds (data is considered fresh for 30s)
- **Cache Time**: 5 minutes (unused data is kept in cache for 5min)
- **Auto-Refresh**: Dashboard and system metrics refresh every 30 seconds
- **Retry Logic**: Failed requests retry up to 3 times with exponential backoff
- **Optimistic Updates**: Create/update/delete operations update the UI immediately

### Troubleshooting

#### API Connection Issues

If you see "Network error" messages:
1. Verify the backend API is running at https://dbx-system-production.up.railway.app
2. Check the `VITE_API_URL` environment variable
3. Ensure CORS is properly configured on the backend
4. Check browser console for detailed error messages

#### Authentication Issues

If you're automatically logged out:
1. Check if the backend `/api/v2/auth/refresh` endpoint is working
2. Verify refresh tokens are being stored correctly
3. Check token expiration times in the backend

#### Data Not Loading

If data doesn't appear:
1. Open browser DevTools Network tab
2. Check if API requests are being made
3. Verify API responses are in the expected format
4. Check browser console for React Query errors

#### Slow Performance

If the app feels slow:
1. Check if auto-refresh intervals are too aggressive
2. Verify the backend API response times
3. Check React Query DevTools for excessive refetching
4. Consider increasing `staleTime` for less frequently changing data

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b07ab2d7-8073-4b32-aada-3faca79e1b62) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
