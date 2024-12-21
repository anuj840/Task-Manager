 

const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const rateLimiter = require('../middlewares/rateLimiter');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user.
 *     description: Registers a new user by providing email, password, and role.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *                
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request.
 */
router.post('/register', AuthController.register);

// /**
//  * @swagger
//  * /user-register:
//  *   post:
//  *     summary: Register a new user with authentication.
//  *     description: This endpoint is used to register a new user with authentication middleware.
//  *     tags:
//  *       - Auth
//  *     security:
//  *       - BearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 example: user@example.com
//  *               password:
//  *                 type: string
//  *                 example: password123
//  *                
//  *     responses:
//  *       201:
//  *         description: User registered successfully.
//  *       401:
//  *         description: Unauthorized.
//  */
// router.post('/user-register', authMiddleware, AuthController.user_registration);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users.
 *     description: Fetches a list of all registered users. Requires authentication.
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: user@example.com
 *                    
 *       401:
 *         description: Unauthorized.
 */
router.get('/users', authMiddleware, roleMiddleware('admin','manager'),AuthController.getUsers);
 

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user.
 *     description: Logs a user in by providing email and password and returns a JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful with JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: jwt-token
 *       401:
 *         description: Unauthorized.
 */
router.post('/login', rateLimiter.sensitiveRateLimit,AuthController.login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout a user.
 *     description: Logs the user out by invalidating the JWT token.
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *       401:
 *         description: Unauthorized.
 */
router.post('/logout', AuthController.logout);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout a user.
 *     description: Logs the user out by invalidating the JWT token.
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *       401:
 *         description: Unauthorized.
 */
router.post('/user-logout', AuthController.user_logout);



module.exports = router;
