# Task Tracker Application

A full-stack web application designed to help users track progress on their projects by managing tasks. Built as part of a Developer Trainee program.

## Table of Contents

*   [Overview](#overview)
*   [Features](#features)
*   [Tech Stack](#tech-stack)
*   [Prerequisites](#prerequisites)
*   [Getting Started](#getting-started)
    *   [Installation](#installation)
    *   [Environment Variables](#environment-variables)
*   [Running the Application](#running-the-application)
*   [API Endpoints](#api-endpoints)
*   [Deployment](#deployment) <!-- Optional: Fill if deployed -->
*   [Screenshots](#screenshots) <!-- Optional: Add if you have them -->
*   [Future Enhancements](#future-enhancements) <!-- Optional: Ideas for improvement -->
*   [License](#license)

## Overview

This application allows users to sign up, log in, and manage up to four projects. Within each project, users can create, read, update, and delete tasks to keep track of their work. It features JWT-based authentication to secure user data and project information.

## Features

*   **User Authentication:**
    *   User Signup (Name, Email, Password, Country)
    *   User Login
    *   JWT (JSON Web Token) for session management and API authentication.
*   **Project Management:**
    *   Create new projects (Limit of 4 projects per user).
    *   View all projects associated with the logged-in user.
*   **Task Management (CRUD):**
    *   Create tasks with Title, Description, and associate them with a project.
    *   Read/View task details (Title, Description, Status, Creation Date, Completion Date).
    *   Update task details, including status (e.g., 'To Do', 'In Progress', 'Done').
    *   Delete tasks.
*   <!-- Add any other bonus features you implemented here -->
    *   _(Example: Task sorting by date)_
    *   _(Example: Search functionality for tasks)_

## Tech Stack

*   **Frontend:**
    *   React.js
    *   React Router (`react-router-dom`) for navigation
    *   Axios for API requests
    *   <!-- Add any UI libraries like Material UI, Chakra UI, or state management like Redux/Zustand if used -->
    *   CSS / CSS Modules <!-- Or specify TailwindCSS, etc. -->
*   **Backend:**
    *   Node.js
    *   Express.js framework
    *   <!-- Choose ONE of the following database sections and DELETE the other -->
    *   **Database (MongoDB):**
        *   MongoDB (Cloud via MongoDB Atlas recommended, or local instance)
        *   Mongoose ODM (Object Data Modeling)
    *   **Database (PostgreSQL):**
        *   PostgreSQL (Cloud via ElephantSQL/Heroku Postgres recommended, or local instance)
        *   Sequelize ORM (Object Relational Mapper) <!-- Or specify 'pg' driver if used directly -->
*   **Authentication:**
    *   JSON Web Tokens (`jsonwebtoken`)
    *   Password Hashing (`bcryptjs`)
*   **Development Tools:**
    *   `nodemon` for automatic server restarts
    *   `dotenv` for environment variable management
    *   `express-validator` for input validation
    *   `cors` for enabling Cross-Origin Resource Sharing

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js and npm](https://nodejs.org/) (LTS version recommended)
*   [Git](https://git-scm.com/)
*   <!-- Choose ONE and DELETE the other -->
*   [MongoDB](https://www.mongodb.com/try/download/community) installed locally OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (Recommended free tier).
*   [PostgreSQL](https://www.postgresql.org/download/) installed locally OR a cloud PostgreSQL provider account (e.g., [ElephantSQL](https://www.elephantsql.com/), [Heroku Postgres](https://www.heroku.com/postgres)).
*   (Optional but Recommended) [Postman](https://www.postman.com/downloads/) or [Insomnia](https://insomnia.rest/download) for API testing.

## Getting Started

Follow these instructions to set up the project locally.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [Your GitHub Repository Link Here]
    cd [Your Project Folder Name, e.g., task-tracker-app]
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Environment Variables

This project uses environment variables for configuration (like database connection strings and secrets). You need to create `.env` files in both the `backend` and `frontend` directories.

**Do NOT commit your `.env` files to version control!** They are included in the `.gitignore` file.

1.  **Backend (`backend/.env`):**
    *   Navigate to the `backend` directory.
    *   Create a file named `.env`.
    *   Add the following variables, replacing the placeholder values with your actual configuration:

        ```dotenv
        # Server Configuration
        PORT=5000 # Or any other port you prefer for the backend

        # Database Configuration
        # --- For MongoDB ---
        MONGO_URI=[Your MongoDB Connection String, e.g., from Atlas or mongodb://localhost:27017/tasktracker]
        # --- For PostgreSQL ---
        # DB_USER=[Your PostgreSQL Username]
        # DB_PASSWORD=[Your PostgreSQL Password]
        # DB_HOST=localhost
        # DB_PORT=5432
        # DB_NAME=[Your PostgreSQL Database Name]
        # DATABASE_URL=postgresql://[Your_DB_User]:[Your_DB_Password]@[Your_DB_Host]:[Your_DB_Port]/[Your_DB_Name] # Sequelize often uses this format

        # JWT Configuration
        JWT_SECRET=[Your_Very_Secret_JWT_Key_Here] # Make this a long, random string

        # CORS Configuration (Optional, for development)
        # CORS_ORIGIN=http://localhost:3000 # The URL of your frontend app
        ```
        <!-- Adjust database variables based on whether you used MongoDB or PostgreSQL -->

2.  **Frontend (`frontend/.env`):**
    *   Navigate to the `frontend` directory.
    *   Create a file named `.env`.
    *   Add the following variable:

        ```dotenv
        # The base URL of your backend API
        REACT_APP_API_URL=http://localhost:5000/api # Use the port your backend is running on, include /api if your routes are prefixed
        ```
        *(Note: React environment variables must start with `REACT_APP_`)*

## Running the Application

You need to run both the backend and frontend servers simultaneously.

1.  **Start the Backend Server:**
    *   Open a terminal, navigate to the `backend` directory.
    *   Run the development server (uses `nodemon` for auto-reloads):
        ```bash
        npm run dev
        ```
    *   Or run the standard start script:
        ```bash
        npm start
        ```
    *   The backend should now be running (typically on `http://localhost:5000`).

2.  **Start the Frontend Development Server:**
    *   Open a *separate* terminal, navigate to the `frontend` directory.
    *   Run the React development server:
        ```bash
        npm start
        ```
    *   This will usually open the application automatically in your default web browser at `http://localhost:3000`. If not, navigate to that URL manually.

You can now access the Task Tracker application in your browser!

## API Endpoints

The following are the main API endpoints provided by the backend:

*   **Authentication (`/api/auth`)**
    *   `POST /signup`: Register a new user.
    *   `POST /login`: Log in an existing user, returns JWT.
*   **Projects (`/api/projects`)** `Requires Authentication`
    *   `POST /`: Create a new project.
    *   `GET /`: Get all projects for the logged-in user.
*   **Tasks (`/api/tasks`)** `Requires Authentication`
    *   `POST /`: Create a new task for a specific project.
    *   `GET /:projectId`: Get all tasks for a specific project.
    *   `GET /task/:taskId`: Get details of a single task. <!-- Confirm if you implemented this specific route -->
    *   `PUT /:taskId`: Update an existing task (e.g., title, description, status).
    *   `DELETE /:taskId`: Delete a task.

*(Note: Routes requiring authentication need the JWT included in the `Authorization: Bearer <token>` header).*

## Deployment

The application is deployed and accessible at:

*   **Frontend URL:** [Link to your deployed frontend, e.g., on Vercel/Netlify]
*   **Backend API URL:** [Link to your deployed backend API, e.g., on Render/Heroku]

**Deployment Platforms:**

*   Frontend hosted on: [e.g., Vercel, Netlify, GitHub Pages]
*   Backend hosted on: [e.g., Render, Heroku, Fly.io]
*   Database hosted on: [e.g., MongoDB Atlas, ElephantSQL, Heroku Postgres]

*Remember to configure environment variables (`MONGO_URI`/`DATABASE_URL`, `JWT_SECRET`, `REACT_APP_API_URL` pointing to the deployed backend, etc.) on your hosting platforms.*


## Future Enhancements

*   Implement drag-and-drop for task status changes.
*   Add due dates and reminders for tasks.
*   Implement task filtering and searching within projects.
*   Add a user profile page for editing details.
*   Improve UI/UX design.
*   Write unit and integration tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details (if you add one).
