/**
 * @swagger
 * tags:
 *   - name: National ID
 *     description: API endpoints for managing lost and found national ID cards
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NationalId:
 *       type: object
 *       description: Represents a found National ID card.
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         lastName:
 *           type: string
 *           description: The last name of the ID holder.
 *           example: "Chauke"
 *         firstName:
 *           type: string
 *           description: The first name of the ID holder.
 *           example: "Vongai"
 *         idNumber:
 *           type: string
 *           description: The national ID number of the holder.
 *           example: "29-1234567B29"
 *         docLocation:
 *           type: string
 *           description: The location where the document can be collected.
 *           example: "Masvingo Central Police"
 *         finderContact:
 *           type: string
 *           description: The contact number of the person who found the document.
 *           example: "0782123456"
 *         status:
 *           type: string
 *           enum: [lost, found]
 *           description: The status of the document.
 *         claimed:
 *           type: boolean
 *           description: Whether the document has been claimed.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the record was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the record was last updated.
 *
 *     NationalIdInput:
 *       type: object
 *       required:
 *         - lastName
 *         - firstName
 *         - idNumber
 *         - docLocation
 *         - finderContact
 *       properties:
 *         lastName:
 *           type: string
 *           example: "Chauke"
 *         firstName:
 *           type: string
 *           example: "Vongai"
 *         idNumber:
 *           type: string
 *           example: "29-1234567B29"
 *         docLocation:
 *           type: string
 *           example: "Masvingo Central Police"
 *         finderContact:
 *           type: string
 *           example: "0782123456"
 */

/**
 * @swagger
 * /api/natId/found:
 *   post:
 *     summary: Report a found national ID card
 *     tags: [National ID]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NationalIdInput'
 *     responses:
 *       201:
 *         description: National ID added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: National ID added successfully.
 *       400:
 *         description: Bad request (e.g., invalid input, duplicate entry).
 *
 * /api/natId/claim/{identifier}:
 *   get:
 *     summary: Claim a found national ID card
 *     tags: [National ID]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: National ID number or last name to search for.
 *         example: "29-1234567B29"
 *     responses:
 *       200:
 *         description: Successfully found the National ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NationalId'
 *       404:
 *         description: National ID not found.
 */

export default {};
