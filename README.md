# TaskManager Project

**TaskManager** is a task management system that allows users to manage tasks, collaborate with teams, and track their progress. The project provides features such as user authentication, role-based access control, and task management with CRUD operations, task assignment, real-time updates, and analytics.

---

## Core Features

### 1. **User Registration**
- **Endpoint**: `/auth/register`
- **Functionality**: Allows users to sign up with their username, email, and password.
- **Validation**:
  - Ensures a valid email format.
  - Enforces strong password criteria (minimum length, at least one number, and one uppercase letter).
- **Optional**: Sends a confirmation email upon successful registration.

---

### 2. **User Login**
- **Endpoint**: `/auth/login`
- **Functionality**:
  - Enables users to log in with their credentials (username/email and password).
  - Issues a JWT token upon successful authentication.
- **Security**: Implements rate limiting to prevent brute-force attacks.

---

### 3. **User Logout**
- **Endpoint**: `/user-logout`
- **Functionality**: Invalidates the JWT token, logging the user out securely.

---

### 4. **Get User Profile**
- **Endpoint**: `/profile`
- **Functionality**: Allows authenticated users to retrieve their profile information, including username, email, and roles.
- **Security**: Accessible only to authenticated users.

---

### 5. **Role-Based Access Control (RBAC)**
- **Roles**:
  - **Admin**: Full access to all endpoints, including user and task management.
  - **Manager**: Can manage tasks and view user profiles within their team.
  - **User**: Can manage personal tasks and view their own profile.
- **Security**: Access restrictions are enforced based on roles at the endpoint level.

---

### 6. **Task Management**
- **CRUD Operations**:
  - **Create Task**: Add new tasks with fields like title, description, due date, priority, and status.
  - **Read Task**: Retrieve a list of tasks with optional filtering and sorting.
  - **Update Task**: Modify existing task details.
  - **Delete Task**: Remove tasks from the system.
- **Security**: Tasks are associated with users, with role-based access control.

---

### 7. **Task Assignment**
- **Functionality**:
  - Assign tasks to specific users.
  - Managers can assign tasks within their teams.
- **Endpoints**:
  - **View Assigned Tasks**: Fetch tasks assigned to a specific user.
  - **Update Task Assignments**: Modify task assignments (e.g., reassign tasks).

---

### 8. **Real-Time Updates**
- **Implementation**: Uses **WebSockets** (e.g., Socket.io) to deliver real-time updates.
- **Functionality**: Notifies users of task changes instantly.

---

### 9. **Analytics**
- **Endpoints**: Provides statistics on completed and pending tasks.
- **Functionality**: Tracks task progress for users and teams.

---

### 10. **Rate Limiting**
- **Implementation**: Protects the API from abuse by limiting the number of requests per user.
- **Configuration**: Adjusts limits based on roles and endpoint sensitivity.

---

### 11. **Search and Filtering**
- **Functionality**: Enables users to search and filter tasks based on criteria such as status and priority.
- **Performance**: Utilizes efficient querying and indexing for optimal speed.

---

### 12. **Swagger UI**
- **Implementation**: Provides interactive API documentation.
- **URL**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## Setup Instructions

### 1. **Clone the Repository**

```bash
git clone https://github.com/anuj840/Task-Manager.git
cd taskmanager

