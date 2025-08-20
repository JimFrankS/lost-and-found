/**
 * @swagger
 * components:
 *   schemas:
 *     Passport:
 *       type: object
 *       description: Represents a found Passport.
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         passportNumber:
 *           type: string
 *           description: The unique passport number.
 *           example: "AB123456"
 *         lastName:
 *           type: string
 *           description: The last name of the passport holder.
 *           example: "Chauke"
 *         firstName:
 *           type: string
 *           description: The first name of the passport holder.
 *           example: "Vongai"
 *         idNumber:
 *           type: string
 *           description: The national ID number of the passport holder.
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
 *     PassportInput:
 *       type: object
 *       required:
 *         - passportNumber
 *         - lastName
 *         - firstName
 *         - idNumber
 *         - docLocation
 *         - finderContact
 *       properties:
 *         passportNumber:
 *           type: string
 *           example: "AB123456"
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
 * tags:
 *   name: Passport
 *   description: API endpoints for managing found passports
 */

/**
 * @swagger
 * /api/passport/found:
 *   post:
 *     summary: Report a found passport
 *     tags: [Passport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PassportInput'
 *     responses:
 *       201:
 *         description: Passport created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Passport created successfully."
 *       400:
 *         description: Bad request (e.g., invalid input, duplicate entry).
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
 *         description: Passport number, national ID number, or last name to search for.
 *         example: "AB123456"
 *     responses:
 *       200:
 *         description: Successfully found the passport.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Passport'
 *       404:
 *         description: Passport not found
 */

export default {};
