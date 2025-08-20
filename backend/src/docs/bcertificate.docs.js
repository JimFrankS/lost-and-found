/**
 * @swagger
 * tags:
 *   - name: Birth Certificate
 *     description: API endpoints for managing lost and found birth certificates
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BirthCertificate:
 *       type: object
 *       required:
 *         - fullName
 *         - dateOfBirth
 *         - certificateNumber
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         fullName:
 *           type: string
 *           description: Full name on the birth certificate
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date of birth in YYYY-MM-DD format
 *         certificateNumber:
 *           type: string
 *           description: Unique birth certificate number
 *         placeOfBirth:
 *           type: string
 *           description: Place of birth
 *         fatherName:
 *           type: string
 *           description: Father's name
 *         motherName:
 *           type: string
 *           description: Mother's name
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
 * /api/bCertificate:
 *   get:
 *     summary: Get all birth certificates
 *     tags: [Birth Certificate]
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
 *         description: List of birth certificates
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
 *                     $ref: '#/components/schemas/BirthCertificate'
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
 * /api/bCertificate/{id}:
 *   get:
 *     summary: Get a birth certificate by ID
 *     tags: [Birth Certificate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Birth certificate ID
 *     responses:
 *       200:
 *         description: Birth certificate details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BirthCertificate'
 *       404:
 *         description: Birth certificate not found
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
 * /api/bCertificate:
 *   post:
 *     summary: Create a new birth certificate record
 *     tags: [Birth Certificate]
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
 *             properties:
 *               fullName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               certificateNumber:
 *                 type: string
 *               placeOfBirth:
 *                 type: string
 *               fatherName:
 *                 type: string
 *               motherName:
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
 *         description: Birth certificate created successfully
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
 *                   example: Birth certificate created successfully
 *                 data:
 *                   $ref: '#/components/schemas/BirthCertificate'
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
 * /api/bCertificate/{id}:
 *   put:
 *     summary: Update a birth certificate
 *     tags: [Birth Certificate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Birth certificate ID
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
 *               placeOfBirth:
 *                 type: string
 *               fatherName:
 *                 type: string
 *               motherName:
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
 *         description: Birth certificate updated successfully
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
 *                   example: Birth certificate updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/BirthCertificate'
 *       404:
 *         description: Birth certificate not found
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
 * /api/bCertificate/{id}:
 *   delete:
 *     summary: Delete a birth certificate
 *     tags: [Birth Certificate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Birth certificate ID
 *     responses:
 *       200:
 *         description: Birth certificate deleted successfully
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
 *                   example: Birth certificate deleted successfully
 *       404:
 *         description: Birth certificate not found
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
