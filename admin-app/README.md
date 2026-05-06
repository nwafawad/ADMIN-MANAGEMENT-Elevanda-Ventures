# Elevanda Ventures - Admin Management System

A comprehensive internal dashboard application tailored for Elevanda staff to seamlessly manage student records, process financial transactions, orchestrate class assignments, verify parent/student devices, and track attendance.

---

## 🏗️ Architecture & Integration

**CRITICAL INTEGRATION PROTOCOL:** This application connects directly to the existing `client_school_db` MongoDB instance utilized by the Elevanda Client Application. 

To ensure complete data consistency between the two systems, the following architectural decisions have been strictly implemented:

1. **Schema Parity**: The Admin App models (`User`, `FeeTransaction`, `FeeBalance`, `Grade`, `Attendance`, `Timetable`, `Class`) exactly replicate the Client App schema structures. Crucial pre-save hooks (such as automatic letter grade computation from numeric scores) function identically across both applications.
2. **Double-Hashing Security**: The Admin App conforms perfectly to the Client App's security pipeline. Passwords entered on the admin dashboard are `SHA-512` hashed using the Web Crypto API on the frontend *before* transiting to the server. The server then performs a robust `salt+hash` operation over that received string.
3. **Atomic Operations**: High-stakes financial updates (fee deposits and withdrawals) are executed within MongoDB Transactions (`session.startTransaction()`). This guarantees that `FeeBalance` documents update atomically alongside their respective `FeeTransaction` status changes, preventing any financial data corruption.
4. **Role Expansion**: The `User` schema enum has been safely expanded to accommodate `teacher` and `admin` roles, maintaining full backward compatibility with the client app's `student` and `parent` workflows.

---

## 💻 Tech Stack

### Frontend Architecture
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM (v6) with Protected Layouts
- **State & Data Fetching**: TanStack React Query (v5)
- **Forms & Validation**: React Hook Form + Zod Schema Validation
- **Styling**: Tailwind CSS (with custom rich aesthetics, glassmorphism, and micro-animations)
- **Data Visualization**: Recharts (for dashboard analytics)
- **Icons**: Lucide React

### Backend Architecture
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) via `httpOnly` cookies
- **Security Middlewares**: Helmet, Express Rate Limit, CORS

---

## ✨ Core Features

### 📊 Executive Dashboard
- Real-time financial cashflow tracking (Deposits vs Withdrawals).
- Live attendance rate calculation via Recharts visualization.
- Quick-action feed for pending device verifications and recent user registrations.

### 👥 User Management
- Unified paginated data table for all user types (Admin, Teacher, Parent, Student).
- Comprehensive User Detail views:
  - **Parents**: Parent-Child account linking workflow.
  - **Students**: Dynamic class assignment, fee history, grade history, and attendance summaries.
- One-click device verification toggles (`isDeviceVerified` flag).

### 📚 Academic Management
- **Class Configuration**: Detailed class builders assigning teachers to specific cohorts.
- **Timetable Scheduling**: Comprehensive weekly schedule management with built-in time-conflict detection.
- **Grades**: Interface for logging numeric scores that automatically compute letter grades (A, B, C, D, F) via Mongoose hooks.
- **Attendance**: Dual-mode attendance tracking featuring both individual student marking and rapid bulk-marking for entire classes.

### 💰 Fee Management
- Dedicated transaction queue for reviewing pending deposits and withdrawals.
- Approval/Rejection pipeline that instantly and atomically updates shared database balances.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Local MongoDB instance running on `localhost:27017`

### 1. Environment Configuration

#### Backend (`/backend/.env`)
Create a `.env` file in the `backend` directory:
\`\`\`env
PORT=5002
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/client_school_db
JWT_SECRET=super_secret_admin_jwt_key_2024
JWT_EXPIRES_IN=8h
ADMIN_ORIGIN=http://localhost:5174
DEFAULT_ADMIN_EMAIL=admin@elevanda.com
DEFAULT_ADMIN_PASSWORD=secureadminpassword
AUTH_LIMIT_MAX=10
LOW_FEE_THRESHOLD=5000
\`\`\`

#### Frontend (`/frontend/.env`)
Create a `.env` file in the `frontend` directory:
\`\`\`env
VITE_API_URL=http://localhost:5002/api
\`\`\`

### 2. Running the Application

#### Start the Backend
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
*(Runs on \`http://localhost:5002\`)*

#### Start the Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*(Runs on \`http://localhost:5174\`)*

---

## 🔐 Initial Seeding & Access

Upon the first boot of the backend server, the `adminSeeder.js` utility will automatically create the initial master administrator account using the credentials defined in your `.env` file.

**Default Admin Credentials:**
- **Email**: `admin@elevanda.com`
- **Password**: `secureadminpassword`

Navigate to `http://localhost:5174/login` and use these credentials to access the portal.

---

## 📁 Repository Structure Highlights

\`\`\`text
/admin-app
  /frontend
    /src
      /components/ui       # Reusable Tailwind UI Kit (Cards, Modals, Buttons, Tables)
      /context             # React Context (AuthContext)
      /hooks               # Custom Hooks (useAuth)
      /pages               # Main route views (Dashboard, Users, Classes, Fees, Academics)
      /schemas             # Zod Validation Schemas
      /services            # Axios API configurations
      /utils               # Formatting and Hashing utilities
  /backend
    /src
      /config              # Environment & DB configurations
      /controllers         # Express route handlers
      /dtos                # Data Transfer Objects (stripping sensitive info)
      /middlewares         # Auth, RBAC, Rate Limiting, Error Handling
      /models              # Mongoose Schemas (Matching Client App)
      /routes              # Express Router definitions
      /seeders             # Initial Admin seeder logic
      /services            # Core Business Logic (Atomic transactions, etc.)
\`\`\`

## 🛡️ Security Posture
- **Rate Limiting**: Configurable thresholds to prevent brute-force attacks on login routes.
- **RBAC**: Strict `adminOnly` middleware ensures all destructive operations are restricted to `role: 'admin'`.
- **JWT Protection**: Tokens are securely transported via `httpOnly`, `lax` same-site cookies, preventing XSS token theft.
- **Data Transfer Objects (DTOs)**: Ensure sensitive data like `passwordHash` and `deviceId` are never leaked to the admin frontend unless explicitly required.
