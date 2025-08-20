/**
 * @swagger
 * tags:
 *   - name: Driver's Licence
 *     description: API endpoints for managing lost and found driver's licence documents
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DriverLicence:
 *       type: object
 *       required:
 *         - ownerName
 *         - licenceNumber
 *         - expiryDate
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         ownerName:
 *           type: string
 *           description: Full name of the licence holder
 *         licenceNumber:
 *           type: string
 *           description: Unique driver's licence number
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Licence expiry date
 *         issueDate:
 *           type: string
 *           format: date
 *           description: Licence issue date
 *         issuingAuthority:
 *           type: string
 *           description: Authority that issued the licence
 *         licenceClass:
 *           type: string
 *           enum: [A, B, C, D, E, F, G]
 *           description: Licence class/category
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date of birth of the licence holder
 *         address:
 *           type: string
 *           description: Address of the licence holder
 *         bloodGroup:
 *           type: string
 *           enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *           description: Blood group of the licence holder
 *         contactInfo:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             phone:
 *               type: string
 *             emergencyContact:
 *               type: string
 *         status:
 *           type: string
 *           enum: [lost, found, claimed]
 *           default: lost
 *         locationFound:
 *           type: string
 *           description: Location where licence was found
 *         dateFound:
 *           type: string
 *           format: date-time
 *           description: Date and time when licence was found
 *         reportedBy:
 *           type: string
 *           description: User who reported the licence
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs (front and back of licence)
 *         additionalNotes:
 *           type: string
 *           description: Additional notes or observations
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/dlicence:
 *   get:
 *     summary: Get all driver's licence records
 *     tags: [Driver's Licence]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [lost, found, claimed]
 *         description: Filter by status
 *       - in: query
 *         name: licenceClass
 *         schema:
 *           type: string
 *           enum: [A, B, C, D, E, F, G]
 *         description: Filter by licence class
 *       - in: query
 *         name: bloodGroup
 *         schema:
 *           type: string
 *           enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *         description: Filter by blood group
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
 *         description: List of driver's licence records
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
 *                     $ref: '#/components/schemas/DriverLicence'
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
 * /api/dlicence/{id}:
 *   get:
 *     summary: Get a driver's licence record by ID
 *     tags: [Driver's Licence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver's licence record ID
 *     responses:
 *       200:
 *         description: Driver's licence record details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DriverLicence'
 *       404:
 *         description: Driver's licence record not found
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
 * /api/dlicence:
 *   post:
 *     summary: Create a new driver's licence record
 *     tags: [Driver's Licence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ownerName
 *               - licenceNumber
 *               - expiryDate
 *             properties:
 *               ownerName:
 *                 type: string
 *               licenceNumber:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               issueDate:
 *                 type: string
 *                 format: date
 *               issuingAuthority:
 *                 type: string
 *               licenceClass:
 *                 type: string
 *                 enum: [A, B, C, D, E, F, G]
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *               bloodGroup:
 *                 type: string
 *                 enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *               contactInfo:
 *                 type: object
 *               status:
 *                 type: string
 *                 enum: [lost, found, claimed]
 *               locationFound:
 *                 type: string
 *               dateFound:
 *                 type: string
 *                 format: date-time
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               additionalNotes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Driver's licence record created successfully
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
 *                   example: Driver's licence record created successfully
 *                 data:
 *                   $ref: '#/components/schemas/DriverLicence'
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
 * /api/dlicence/{id}:
 *   put:
 *     summary: Update a driver's licence record
 *     tags: [Driver's Licence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver's licence record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerName:
 *                 type: string
 *               licenceNumber:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               issueDate:
 *                 type: string
 *                 format: date
 *               issuingAuthority:
 *                 type: string
 *               licenceClass:
 *                 type: string
 *                 enum: [A, B, C, D, E, F, G]
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *               bloodGroup:
 *                 type: string
 *                 enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *               contactInfo:
 *                 type: object
 *               status:
 *                 type: string
 *                 enum: [lost, found, claimed]
 *               locationFound:
 *                 type: string
 *               dateFound:
 *                 type: string
 *                 format: date-time
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               additionalNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Driver's licence record updated successfully
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
 *                   example: Driver's licence record updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/DriverLicence'
 *       404:
 *         description: Driver's licence record not found
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
 * /api/dlicence/{id}:
 *   delete:
 *     summary: Delete a driver's licence record
 *     tags: [Driver's Licence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver's licence record ID
 *     responses:
 *       200:
 *         description: Driver's licence record deleted successfully
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
 *                   example: Driver's licence record deleted successfully
 *       404:
 *         description: Driver's licence record not found
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
