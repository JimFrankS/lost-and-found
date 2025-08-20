/**
 * @swagger
 * tags:
 *   name: Birth Certificate
 *   description: API endpoints for managing found birth certificates
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BirthCertificate:
 *       type: object
 *       description: Represents a found Birth Certificate.
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         motherLastName:
 *           type: string
 *           description: The last name of the mother.
 *           example: "Moyo"
 *         lastName:
 *           type: string
 *           description: The last name of the child.
 *           example: "Chauke"
 *         firstName:
 *           type: string
 *           description: The first name of the child.
 *           example: "Vongai"
 *         secondName:
 *           type: string
 *           description: The second name of the child (optional).
 *           example: "Tatenda"
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
 *     BirthCertificateInput:
 *       type: object
 *       required:
 *         - motherLastName
 *         - lastName
 *         - firstName
 *         - docLocation
 *         - finderContact
 *       properties:
 *         motherLastName:
 *           type: string
 *           example: "Moyo"
 *         lastName:
 *           type: string
 *           example: "Chauke"
 *         firstName:
 *           type: string
 *           example: "Vongai"
 *         secondName:
 *           type: string
 *           example: "Tatenda"
 *         docLocation:
 *           type: string
 *           example: "Masvingo Central Police"
 *         finderContact:
 *           type: string
 *           example: "0782123456"
 */

/**
 * @swagger
 * /api/bCertificate/found:
 *   post:
 *     summary: Report a found birth certificate
 *     tags: [Birth Certificate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BirthCertificateInput'
 *     responses:
 *       201:
 *         description: Certificate added successfully.
 *       400:
 *         description: Bad request (e.g., invalid input, duplicate entry).
 *
 * /api/bCertificate/claim:
 *   get:
 *     summary: Claim a found birth certificate
 *     tags: [Birth Certificate]
 *     parameters:
 *       - in: query
 *         name: lastName
 *         required: true
 *         schema:
 *           type: string
 *         description: The last name of the child.
 *         example: "Chauke"
 *       - in: query
 *         name: motherLastName
 *         required: true
 *         schema:
 *           type: string
 *         description: The last name of the mother.
 *         example: "Moyo"
 *     responses:
 *       200:
 *         description: Successfully found the birth certificate.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BirthCertificate'
 *       404:
 *         description: Certificate not found.
 */

export default {};
