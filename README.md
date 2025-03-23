# SnapSphere

## Introduction

SnapSphere is a web application that allows users to manage and share images, with AI-powered editing capabilities. Technologies used: Nextjs, Nestjs, Clerk, MongoDB, Redis.

## System Requirements

-   Docker and Docker Compose
-   Node.js (version 18 or higher)
-   npm is only needed for development

## Project Structure

```
snapsphere/
├── backend/         # API Backend (NestJS)
├── frontend/        # User Interface (Next.js)
└── docker-compose.yml
```

## How to Run the Project

### Using Docker (Recommended)

1. Navigate to the project's root directory:

```bash
cd snapsphere
```

2. Run the application:

```bash
docker-compose -p <project_name> up -d --build
```

After completion:

-   Frontend will be running at: http://localhost:3000
-   Backend API will be running at: http://localhost:8000

### Running in Development Environment

#### Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Run the application in development mode:

```bash
npm run dev
```

#### Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the application in development mode:

```bash
npm run dev
```

### Deployment Link:

https://snapsphere-two.vercel.app/
