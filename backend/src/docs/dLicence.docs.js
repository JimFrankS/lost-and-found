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
 *       description: Represents a found Driver's Licence.
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         licenceNumber:
 *           type: string
 *           description: The unique driver's licence number.
 *           example: "123456AB"
 *         lastName:
 *           type: string
 *           description: The last name of the licence holder.
 *           example: "Chauke"
 *         firstName:
 *           type: string
 *           description: The first name of the licence holder.
 *           example: "Vongai"
 *         idNumber:
 *           type: string
 *           description: The national ID number of the licence holder.
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
 *     DriverLicenceInput:
 *       type: object
 *       required:
 *         - licenceNumber
 *         - lastName
 *         - firstName
 *         - idNumber
 *         - docLocation
 *         - finderContact
 *       properties:
 *         licenceNumber:
 *           type: string
 *           description: The unique driver's licence number.
 *           example: "123456AB"
 *         lastName:
 *           type: string
 *           description: The last name of the licence holder.
 *           example: "Chauke"
 *         firstName:
 *           type: string
 *           description: The first name of the licence holder.
 *           example: "Vongai"
 *         idNumber:
 *           type: string
 *           description: The national ID number of the licence holder.
 *           example: "29-1234567B29"
 *         docLocation:
 *           type: string
 *           description: The location where the document can be collected.
 *           example: "Masvingo Central Police"
 *         finderContact:
 *           type: string
 *           description: The contact number of the person who found the document.
 *           example: "0782123456"
 */

/**
 * @swagger
 * /api/dLicence/found:
 *   post:
 *     summary: Report a found driver's licence
 *     tags: [Driver's Licence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DriverLicenceInput'
 *     responses:
 *       201:
 *         description: Licence added successfully.
 *       400:
 *         description: Bad request (e.g., invalid input, duplicate entry).
 *
 * /api/dLicence/claim/{identifier}:
 *   get:
 *     summary: Claim a found driver's licence
 *     tags: [Driver's Licence]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: Licence number, national ID number, or last name to search for.
 *         example: "123456AB"
 *     responses:
 *       200:
 *         description: Successfully found the driver's licence.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DriverLicence'
 *       404:
 *         description: Licence not found.
 */

export default {};
