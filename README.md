# TaskManager Project

TaskManager is a task management system that allows users to manage their tasks, collaborate with teams, and track their progress. This project provides user authentication, role-based access control, and task management with CRUD operations, task assignment, and advanced features like real-time updates and analytics.

## Core Features

### 1. **User Registration**
- **Endpoint**: `/auth/register`
- **Functionality**: Users can sign up by providing their username, email, and password.
- **Validation**:
  - Valid email format is required.
  - Strong password criteria are enforced (minimum length, at least one number, one uppercase letter).
- **Optional**: A confirmation email can be sent upon successful registration.

### 2. **User Login**
- **Endpoint**: `/auth/login`
- **Functionality**: Registered users can log in using their credentials (username/email and password).
  - Validate user credentials.
  - Upon successful login, a JWT token is issued for authentication.
- **Security**: Rate limiting is implemented to prevent brute-force attacks.

### 3. **User Logout**
- **Endpoint**: `/user-logout`
- **Functionality**: Invalidates the JWT token, logging the user out securely.

### 4. **Get User Profile**
- **Endpoint**: `/profile`
- **Functionality**: Retrieve the profile information of the authenticated user, including fields such as username, email, and roles.
- **Security**: The endpoint is protected and accessible only to authenticated users.

### 5. **Role-Based Access Control (RBAC)**
- **Implementation**: Different roles with varying access levels:
  - **Admin**: Full access to all endpoints, including user management and task assignment.
  - **Manager**: Can manage tasks and view user profiles within their team.
  - **User**: Can manage their own tasks and view their own profile.
- **Security**: Role-based access restrictions are enforced at the endpoint level.

### 6. **Task Management**
- **CRUD Operations**:
  - **Create Task**: Endpoint to create a new task with fields such as title, description, due date, priority, and status.
  - **Read Task**: Endpoint to retrieve a list of tasks, with optional filtering and sorting parameters.
  - **Update Task**: Endpoint to update task details.
  - **Delete Task**: Endpoint to delete a task.
- **Security**: Tasks are associated with users, and access control is enforced.

### 7. **Task Assignment**
- **Functionality**:
  - Assign tasks to users.
  - Managers can assign tasks to users within their team.
- **Endpoints**:
  - **View Assigned Tasks**: View tasks assigned to a specific user.
  - **Update Task Assignments**: Update task assignments (e.g., reassign tasks).

---

 

### 1. **Real-Time Updates**
- **Implementation**: Use **WebSockets** (e.g., Socket.io) to implement real-time updates for task changes.
- **Functionality**: Notify users of task changes in real time, keeping them up to date with the latest information.

### 2. **Analytics**
- **Endpoints**: Provide basic analytics endpoints to track the number of tasks completed and  pending
- **Functionality**: Retrieve task completion statistics by user and team.



### 4. **Rate Limiting**
- **Implementation**: Apply rate limiting to protect the API from abuse.
- **Configuration**: Configure rate limits based on user roles and endpoint sensitivity.

### 5. **Search and Filtering**
- **Functionality**: Implement search and filtering for tasks based on various criteria (e.g., status, priority ).
- **Performance**: Ensure efficient querying and indexing for optimal performance.
- 
### 6. **Swagger UI **
Swagger UI available at http://localhost:5000/api-docs
---

## Setup Instructions

### 1. **Clone the Repository**

```bash
git clone https://github.com/anuj840/Task-Manager.git
cd taskmanager
