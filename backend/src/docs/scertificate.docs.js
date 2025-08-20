/**
 * @swagger
 * tags:
 *   name: School Certificate
 *   description: API endpoints for managing found school certificates
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SchoolCertificate:
 *       type: object
 *       description: Represents a found School Certificate.
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         certificateType:
 *           type: string
 *           enum: [Olevel, Alevel, Poly, University, Other]
 *           description: The type of the school certificate.
 *           example: "Olevel"
 *         lastName:
 *           type: string
 *           description: The last name of the certificate holder.
 *           example: "Chauke"
 *         firstName:
 *           type: string
 *           description: The first name of the certificate holder.
 *           example: "Vongai"
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
 *     SchoolCertificateInput:
 *       type: object
 *       required:
 *         - certificateType
 *         - lastName
 *         - firstName
 *         - docLocation
 *         - finderContact
 *       properties:
 *         certificateType:
 *           type: string
 *           enum: [Olevel, Alevel, Poly, University, Other]
 *           example: "Olevel"
 *         lastName:
 *           type: string
 *           example: "Chauke"
 *         firstName:
 *           type: string
 *           example: "Vongai"
 *         docLocation:
 *           type: string
 *           example: "Masvingo Central Police"
 *         finderContact:
 *           type: string
 *           example: "0782123456"
 */

/**
 * @swagger
 * /api/sCertificate/found:
 *   post:
 *     summary: Report a found school certificate
 *     tags: [School Certificate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SchoolCertificateInput'
 *     responses:
 *       201:
 *         description: Certificate added successfully.
 *       400:
 *         description: Bad request (e.g., invalid input, duplicate entry).
 *
 * /api/sCertificate/claim:
 *   get:
 *     summary: Claim a found school certificate
 *     tags: [School Certificate]
 *     parameters:
 *       - in: query
 *         name: lastName
 *         required: true
 *         schema:
 *           type: string
 *         description: The last name of the certificate holder.
 *         example: "Chauke"
 *       - in: query
 *         name: certificateType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Olevel, Alevel, Poly, University, Other]
 *         description: The type of the school certificate.
 *         example: "Olevel"
 *     responses:
 *       200:
 *         description: Successfully found the school certificate.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchoolCertificate'
 *       404:
 *         description: Certificate not found.
 */

export default {};
