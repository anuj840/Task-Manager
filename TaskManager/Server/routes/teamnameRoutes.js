 
const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/TeamNameController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware')

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Operations related to managing teams
 */

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create a new team
 *     description: Allows admins or authorized users to create a new team.
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Team created successfully
 *       400:
 *         description: Invalid data provided
 *       403:
 *         description: Unauthorized. Only authorized users can create teams
 */
router.post('/teams', authMiddleware, TeamController.createTeam);

/**
 * @swagger
 * /teams/{teamId}:
 *   get:
 *     summary: Get a specific team by ID
 *     description: Fetches the details of a specific team by its teamId. If teamId is not provided, returns all teams.
 *     tags: [Teams]
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: false
 *         description: The ID of the team to fetch
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Team details or list of teams
 *       404:
 *         description: Team not found
 *       403:
 *         description: Unauthorized. Only authorized users can fetch team details
 */
/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: API for managing teams
 */

/**
 * @swagger
 * /teams/{teamId}:
 *   get:
 *     summary: Get a team by its ID or list of teams
 *     description: Retrieve the details of a specific team if `teamId` is provided or a list of all teams.
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: false
 *         description: The ID of the team.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with team(s) data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *       403:
 *         description: Forbidden - User does not have permission.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/teams/:teamId?', roleMiddleware('manager', 'admin'), authMiddleware, TeamController.getTeams);

/**
 * @swagger
 * /teams/{teamId}:
 *   put:
 *     summary: Update a team by its ID
 *     description: Update the details of a team with a specific ID.
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: The ID of the team to update.
 *         schema:
 *           type: string
 *       - in: body
 *         name: team
 *         description: The team details to update.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: New team name.
 *     responses:
 *       200:
 *         description: Successful update with team data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad Request - Invalid input data.
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *       403:
 *         description: Forbidden - User does not have permission.
 *       500:
 *         description: Internal Server Error.
 */
router.put('/teams/:teamId', roleMiddleware('manager', 'admin'), authMiddleware, TeamController.updateTeam);

/**
 * @swagger
 * /teams/{teamId}:
 *   delete:
 *     summary: Delete a team by its ID
 *     description: Delete a specific team by its ID.
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: The ID of the team to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful deletion.
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *       403:
 *         description: Forbidden - User does not have permission.
 *       404:
 *         description: Not Found - Team with the specified ID does not exist.
 *       500:
 *         description: Internal Server Error.
 */
router.delete('/teams/:teamId', roleMiddleware('manager', 'admin'), authMiddleware, TeamController.deleteTeam);



module.exports = router;
