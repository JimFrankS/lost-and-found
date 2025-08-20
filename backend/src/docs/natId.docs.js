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
 *       required:
 *         - fullName
 *         - dateOfBirth
 *         - idNumber
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         fullName:
 *           type: string
 *           description: Full name of the ID holder
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date of birth in YYYY-MM-DD format
 *         idNumber:
 *           type: string
 *           description: Unique national ID number
 *         issueDate:
 *           type: string
 *           format: date
 *           description: ID issue date
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: ID expiry date
 *         placeOfIssue:
 *           type: string
 *           description: Place where ID was issued
 *         nationality:
 *           type: string
 *           description: Nationality of the ID holder
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
 *           description: Additional description or notes
 *         locationFound:
 *           type: string
 *           description: Location where ID was found
 *         dateFound:
 *           type: string
 *           format: date-time
 *           description: Date and time when ID was found
 *         reportedBy:
 *           type: string
 *           description: User who reported the ID
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
 * /api/natId:
 *   get:
 *     summary: Get all national ID cards
 *     tags: [National ID]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [lost, found, claimed]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of national ID cards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NationalId'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/natId/{id}:
 *   get:
 *     summary: Get a national ID card by ID
 *     tags: [National ID]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: National ID card ID
 *     responses:
 *       200:
 *         description: National ID card details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/NationalId'
 *       404:
 *         description: National ID card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/natId:
 *   post:
 *     summary: Create a new national ID card record
 *     tags: [National ID]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - dateOfBirth
 *               - idNumber
 *             properties:
 *               fullName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               idNumber:
 *                 type: string
 *               issueDate:
 *                 type: string
 *                 format: date
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               placeOfIssue:
 *                 type: string
 *               nationality:
 *                 type: string
 *               contactInfo:
 *                 type: object
 *               status:
 *                 type: string
 *                 enum: [lost, found, claimed]
 *               description:
 *                 type: string
 *               locationFound:
 *                 type: string
 *               dateFound:
 *                 type: string
 *                 format: date-time
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: National ID card created successfully
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
 *                   example: National ID card created successfully
 *                 data:
 *                   $ref: '#/components/schemas/NationalId'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/natId/{id}:
 *   put:
 *     summary: Update a national ID card
 *     tags: [National ID]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: National ID card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               idNumber:
 *                 type: string
 *               issueDate:
 *                 type: string
 *                 format: date
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               placeOfIssue:
 *                 type: string
 *               nationality:
 *                 type: string
 *               contactInfo:
 *                 type: object
 *               status:
 *                 type: string
 *                 enum: [lost, found, claimed]
 *               description:
 *                 type: string
 *               locationFound:
 *                 type: string
 *               dateFound:
 *                 type: string
 *                 format: date-time
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: National ID card updated successfully
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
 *                   example: National ID card updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/NationalId'
 *       404:
 *         description: National ID card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/natId/{id}:
 *   delete:
 *     summary: Delete a national ID card
 *     tags: [National ID]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: National ID card ID
 *     responses:
 *       200:
 *         description: National ID card deleted successfully
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
 *                   example: National ID card deleted successfully
 *       404:
 *         description: National ID card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export default {};
