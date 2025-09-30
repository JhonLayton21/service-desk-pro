# Service Desk Pro - Frontend

This is the frontend application for Service Desk Pro, built with Next.js, TypeScript, and shadcn/ui.

## Features

- **Authentication System**: Login and signup with role-based access control
- **Role-based Dashboards**: Different views for Requester, Agent, and Manager roles
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## User Roles

The application supports three user roles with different dashboard views:

### Requester
- Create new tickets
- View and manage their own tickets
- Access knowledge base

### Agent
- View assigned tickets
- Manage ticket status and priority
- Access performance metrics
- Create knowledge articles

### Manager
- Overview of all tickets and team performance
- Access to reports and analytics
- User management capabilities
- System settings

## Test Users

Based on the seed data, you can test with these users:

1. **Manager**: 
   - Email: admin@servicedesk.com
   - Password: admin123

2. **Agent**: 
   - Email: agent@servicedesk.com
   - Password: agent123

3. **Requester**: 
   - Email: john@example.com
   - Password: user123

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Backend Requirements

Make sure the backend is running on port 3001 with the authentication endpoints:
- POST /auth/login
- POST /auth/register

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```