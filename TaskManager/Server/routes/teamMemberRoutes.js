 

const express = require('express');
const router = express.Router();
const TeamMemberController = require('../controllers/TeamMemberController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: TeamMembers
 *   description: Operations related to managing team members
 */

/**
 * @swagger
 * /teammembers:
 *   post:
 *     summary: Add team members
 *     description: Allows admins or authorized users to add new team members.
 *     tags: [TeamMembers]
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
 *               role:
 *                 type: string
 *               teamId:
 *                 type: string
 *               contact:
 *                 type: string
 *     responses:
 *       201:
 *         description: Team members added successfully
 *       400:
 *         description: Invalid data provided
 *       403:
 *         description: Unauthorized. Only authorized users can add team members
 */
router.post('/teammembers', authMiddleware, TeamMemberController.addTeamMembers);

/**
 * @swagger
 * /teammembers/{teamId}/members:
 *   get:
 *     summary: Fetch all team members by teamId
 *     description: Fetches all team members that belong to a specific team.
 *     tags: [TeamMembers]
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         description: The ID of the team to fetch members for
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of team members
 *       404:
 *         description: Team not found
 *       403:
 *         description: Unauthorized. Only authorized users can fetch team members
 */
router.get('/teammembers/:teamId/members', authMiddleware, TeamMemberController.getTeamMembers);

module.exports = router;
