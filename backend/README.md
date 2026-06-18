# Employee Management Admin Portal

A full-stack web application for managing employees, departments, and roles, with role-based access control. Built as an internship project using React, Node.js/Express, MySQL, and Sequelize.

---

## Tech Stack

**Frontend:** React, Vite, Ant Design, Axios, React Router  
**Backend:** Node.js, Express, Sequelize ORM  
**Database:** MySQL  
**Authentication:** JSON Web Tokens (JWT), bcrypt

---

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <https://github.com/sean-dataseers/employee-management-portal.git>
cd emp-portal
```

### 2. Configure the backend environment

Create a `.env` file inside the `backend/` folder:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=emp_portal
JWT_SECRET=your_secret_key
PORT=5000
```

### 3. Install dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 4. Set up the database

Make sure MySQL is running, then from the `backend/` folder:

```bash
# Run all migrations (creates tables)
npx sequelize-cli db:migrate

# Run all seeders (creates default roles, departments, and admin user)
npx sequelize-cli db:seed:all
```

### 5. Start the servers

You need two terminals running simultaneously:

**Terminal 1 — Backend** (from `backend/` folder):
```bash
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 — Frontend** (from `frontend/` folder):
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## Default Login Credentials

| Username | Password | Permission Level |
|----------|----------|-----------------|
| admin | admin123 | Admin (full access) |
| manager | manager123 | Manager |
| employee | employee123 | Employee (read-only) |

> **Note:** JWT tokens expire after 1 hour. If the app appears broken after a break, log out and log back in to get a fresh token.

Also Disclaimer: If you want to permenently delete an or all employee(s) from the database (no reason to do so in the setup but for later on), 
you must do that directly through SQL or the terminal with the command "DELETE FROM employees;" and to reset the employee ID values (so your new employees 
wont be counting off the deleted ones): "ALTER TABLE employees AUTO_INCREMENT = 1;"

---

## Features

### Authentication
- Login with username and password (JWT-based)
- Public signup — new accounts default to Employee permissions
- Role-based access control enforced on both frontend and backend

### Departments
- View all departments (all authenticated users)
- Create, edit, and delete departments (Admin only)

### Roles
- View all roles with their permission levels (all authenticated users)
- Create, edit, and delete roles (Admin only)
- Assign permission levels (Admin/Manager/Employee) to any role via dropdown

### Employees
- View all employees with search and pagination (all authenticated users)
- Create and edit employees (Admin and Manager)
- Deactivate/reactivate employees (Admin and Manager)
- Role assignment on employee records (Admin only)
- Self-signup automatically creates a linked Employee record

### Permission System
- Three permission tiers: **Admin**, **Manager**, **Employee**
- Permission levels are decoupled from role names — custom roles can be created and assigned any permission tier
- Backend enforces all restrictions via middleware
- Frontend hides/disables controls the logged-in user isn't allowed to use
- Admins can promote self-registered users by editing their linked Employee record's role

---

## Project Structure

```
emp-portal/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handler logic
│   ├── middleware/      # Authentication and authorization middleware
│   ├── migrations/      # Database schema migrations
│   ├── models/          # Sequelize models
│   ├── routes/          # Express route definitions
│   ├── seeders/         # Seed data (roles, departments, users)
│   └── server.js        # Entry point
└── frontend/
    ├── src/
    │   ├── api/          # Axios instance
    │   ├── components/   # Shared components (Layout, ProtectedRoute)
    │   └── pages/        # Page components (Login, Signup, Dashboard, Employees, Departments, Roles)
    └── index.html
```

---

## Notes

- The `.env` file is not included in the repository for security reasons. Create it manually using the template above.
- Servers must be restarted manually each session (backend on port 5000, frontend on port 5173).
- The `node_modules/` folder is excluded via `.gitignore` — run `npm install` in both `backend/` and `frontend/` after cloning.
