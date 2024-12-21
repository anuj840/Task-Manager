 
const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to user profiles and management
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     description: Fetches the profile details of the authenticated user.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched user profile
 *       401:
 *         description: Unauthorized. User must be logged in.
 */
router.get('/profile', authMiddleware, UserController.getProfile);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Fetches the details of all users. This route is accessible only to admins.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all users
 *       403:
 *         description: Forbidden. Admin privileges are required.
 *       401:
 *         description: Unauthorized. User must be logged in.
 */
router.get('/', authMiddleware, roleMiddleware('admin','manager'), UserController.getAllUsers);

module.exports = router;

