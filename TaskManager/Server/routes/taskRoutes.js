 
const express = require('express');
const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware'); // For RBAC
const rateLimiter = require('../middlewares/rateLimiter');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management operations
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     description: Only managers and admins can assign tasks
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       201:
 *         description: Task created successfully
 *       403:
 *         description: Unauthorized. Only managers and admins can assign tasks
 */
router.post('/', authMiddleware, roleMiddleware('manager'), rateLimiter.adminManagerRateLimit, TaskController.createTask);

/**
 * @swagger
 * /tasks/user-task/{id}:
 *   get:
 *     summary: Get a specific task by ID (Admin)
 *     description: Get a task by its ID for a specific user (Admin only)
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the task to fetch
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *       404:
 *         description: Task not found
 */
router.get('/user-task/:id', authMiddleware, TaskController.getTaskById);

/**
 * @swagger
 * /tasks/user-task:
 *   get:
 *     summary: Get all tasks for the user
 *     description: Fetch tasks assigned to the current authenticated user
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/user-task', authMiddleware, TaskController.getTasks);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for the user
 *     description: Fetch tasks assigned to the current authenticated user
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/fetch-user-task', authMiddleware, rateLimiter.generalRateLimit,TaskController.fetchUserTasks);

/**
 * @swagger
 * /tasks/task/{taskId}/users:
 *   get:
 *     summary: Get users assigned to a task
 *     description: Fetch all users assigned to a specific task by task ID
 *     tags: [Tasks]
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: The ID of the task
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users assigned to the task
 */
router.get('/task/:taskId/users', authMiddleware, TaskController.fetchUserIdsBasedOnTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update task details
 *     description: Accessible by managers, admins, or task owners
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the task to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       403:
 *         description: Unauthorized. Only managers, admins, or task owners can update tasks
 */
router.put('/:id', authMiddleware, TaskController.updateTask);

/**
 * @swagger
 * /tasks:
 *   put:
 *     summary: Update task status
 *     description: Accessible by managers, admins, or task owners
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [not-started, in-progress, completed]
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       403:
 *         description: Unauthorized. Only managers, admins, or task owners can update status
 */
router.put('/', authMiddleware, TaskController.updateTaskStatus);

/**
 * @swagger
 * /tasks/tasks/{taskId}/status:
 *   put:
 *     summary: Update task status by task ID
 *     description: Accessible by managers, admins, or task owners
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: The ID of the task to update the status
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [not-started, in-progress, completed]
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       403:
 *         description: Unauthorized. Only managers, admins, or task owners can update status
 */
router.put('/user-tasks-update/:taskId/status', authMiddleware, TaskController.updateTaskStatus);
/**
 * @swagger
 * /task-status-analytics:
 *   get:
 *     summary: Get Task Status Analytics
 *     description: Fetch analytics data for task statuses, accessible by users with the roles 'manager' or 'admin'.
 *     tags: [Task Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with task analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example:
 *                     completed: 50
 *                     inProgress: 20
 *                     pending: 30
 *       401:
 *         description: Unauthorized. Invalid or missing authentication token
 *       403:
 *         description: Forbidden. Only managers or admins can access this route
 */

// // Define a route to get task status analytics
router.get('/task-status-analytics', roleMiddleware('manager','admin'),authMiddleware,TaskController.getTaskStatusAnalytics);
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Accessible by managers, admins, or task owners
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the task to delete
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       403:
 *         description: Unauthorized. Only managers, admins, or task owners can delete tasks
 */
router.delete('/:id', authMiddleware, TaskController.deleteTask);



// task status for the particular user to see thier own task status 
router.get('/task-progress/:taskId/:userId',TaskController. getStatusByTaskAndUser);





module.exports = router;
