/**
 * @swagger
 * tags:
 *   - name: School Certificate
 *     description: API endpoints for managing lost and found school certificates
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SchoolCertificate:
 *       type: object
 *       required:
 *         - fullName
 *         - dateOfBirth
 *         - certificateNumber
 *         - schoolName
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         fullName:
 *           type: string
 *           description: Full name on the certificate
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date of birth in YYYY-MM-DD format
 *         certificateNumber:
 *           type: string
 *           description: Unique certificate number
 *         schoolName:
 *           type: string
 *           description: Name of the school
 *         grade:
 *           type: string
 *           description: Grade or level achieved
 *         yearOfCompletion:
 *           type: string
 *           description: Year of completion
 *         issueDate:
 *           type: string
 *           format: date
 *           description: Certificate issue date
 *         placeOfIssue:
 *           type: string
 *           description: Place where certificate was issued
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
 *           description: Location where certificate was found
 *         dateFound:
 *           type: string
 *           format: date-time
 *           description: Date and time when certificate was found
 *         reportedBy:
 *           type: string
 *           description: User who reported the certificate
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
 * /api/sCertificate:
 *   get:
 *     summary: Get all school certificates
 *     tags: [School Certificate]
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
 *         description: List of school certificates
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
 *                     $ref: '#/components/schemas/SchoolCertificate'
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
 * /api/sCertificate/{id}:
 *   get:
 *     summary: Get a school certificate by ID
 *     tags: [School Certificate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School certificate ID
 *     responses:
 *       200:
 *         description: School certificate details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SchoolCertificate'
 *       404:
 *         description: School certificate not found
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
 * /api/sCertificate:
 *   post:
 *     summary: Create a new school certificate record
 *     tags: [School Certificate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - dateOfBirth
 *               - certificateNumber
 *               - schoolName
 *             properties:
 *               fullName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               certificateNumber:
 *                 type: string
 *               schoolName:
 *                 type: string
 *               grade:
 *                 type: string
 *               yearOfCompletion:
 *                 type: string
 *               issueDate:
 *                 type: string
 *                 format: date
 *               placeOfIssue:
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
 *         description: School certificate created successfully
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
 *                   example: School certificate created successfully
 *                 data:
 *                   $ref: '#/components/schemas/SchoolCertificate'
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
 * /api/sCertificate/{id}:
 *   put:
 *     summary: Update a school certificate
 *     tags: [School Certificate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School certificate ID
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
 *               certificateNumber:
 *                 type: string
 *               schoolName:
 *                 type: string
 *               grade:
 *                 type: string
 *               yearOfCompletion:
 *                 type: string
 *               issueDate:
 *                 type: string
 *                 format: date
 *               placeOfIssue:
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
 *         description: School certificate updated successfully
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
 *                   example: School certificate updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/SchoolCertificate'
 *       404:
 *         description: School certificate not found
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
 * /api/sCertificate/{id}:
 *   delete:
 *     summary: Delete a school certificate
 *     tags: [School Certificate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School certificate ID
 *     responses:
 *       200:
 *         description: School certificate deleted successfully
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
 *                   example: School certificate deleted successfully
 *       404:
 *         description: School certificate not found
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
