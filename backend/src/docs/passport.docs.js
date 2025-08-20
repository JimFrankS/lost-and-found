/**
 * @swagger
 * components:
 *   schemas:
 *     Passport:
 *       type: object
 *       required:
 *         - fullName
 *         - dateOfBirth
 *         - passportNumber
 *         - nationality
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         fullName:
 *           type: string
 *           description: Full name as it appears on passport
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date of birth in YYYY-MM-DD format
 *         passportNumber:
 *           type: string
 *           description: Unique passport number
 *         nationality:
 *           type: string
 *           description: Nationality of passport holder
 *         issueDate:
 *           type: string
 *           format: date
 *           description: Passport issue date
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Passport expiry date
 *         placeOfIssue:
 *           type: string
 *           description: Place where passport was issued
 *         contactInfo:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             phone:
 *               type: string
 *             address:
 *               type: string
 *         status:
 *           type: string
 *           enum: [lost, found, claimed]
 *           default: lost
 *         description:
 *           type: string
 *           description: Additional description or notes about the passport
 *         locationFound:
 *           type: string
 *           description: Location where passport was found
 *         dateFound:
 *           type: string
 *           format: date-time
 *           description: Date and time when passport was found
 *         reportedBy:
 *           type: string
 *           description: User who reported the passport
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Passport
 *   description: API endpoints for managing lost and found passports
 */

/**
 * @swagger
 * /api/passport/lost:
 *   post:
 *     summary: Report a lost passport
 *     tags: [Passport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - dateOfBirth
 *               - passportNumber
 *               - nationality
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-15"
 *               passportNumber:
 *                 type: string
 *                 example: "A12345678"
 *               nationality:
 *                 type: string
 *                 example: "United States"
 *               issueDate:
 *                 type: string
 *                 format: date
 *                 example: "2020-01-15"
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: "2030-01-14"
 *               placeOfIssue:
 *                 type: string
 *                 example: "Washington, DC"
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "john.doe@email.com"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *                   address:
 *                     type: string
 *                     example: "123 Main St, City, State"
 *               description:
 *                 type: string
 *                 example: "Lost passport while traveling in Europe"
 *               locationFound:
 *                 type: string
 *                 example: "Airport security checkpoint"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/passport-front.jpg", "https://example.com/passport-back.jpg"]
 *     responses:
 *       201:
 *         description: Passport reported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Passport reported as lost successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Passport'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/passport/claim/{identifier}:
 *   get:
 *     summary: Claim a found passport
 *     tags: [Passport]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: Passport number or ID to claim
 *     responses:
 *       200:
 *         description: Passport claimed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Passport claimed successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Passport'
 *       404:
 *         description: Passport not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export default {};
