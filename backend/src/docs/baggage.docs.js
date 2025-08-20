/**
 * @swagger
 * tags:
 *   - name: Baggage
 *     description: API endpoints for managing lost and found baggage items
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Baggage:
 *       type: object
 *       required:
 *         - ownerName
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         ownerName:
 *           type: string
 *           description: Name of the baggage owner
 *         description:
 *           type: string
 *           description: Detailed description of the baggage
 *         bagType:
 *           type: string
 *           enum: [suitcase, backpack, handbag, laptop_bag, other]
 *           description: Type of baggage
 *         color:
 *           type: string
 *           description: Color of the baggage
 *         brand:
 *           type: string
 *           description: Brand of the baggage
 *         flightNumber:
 *           type: string
 *           description: Flight number associated with the baggage
 *         seatNumber:
 *           type: string
 *           description: Seat number associated with the baggage
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
 *         locationFound:
 *           type: string
 *           description: Location where baggage was found
 *         dateFound:
 *           type: string
 *           format: date-time
 *           description: Date and time when baggage was found
 *         reportedBy:
 *           type: string
 *           description: User who reported the baggage
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
 * /api/baggage:
 *   get:
 *     summary: Get all baggage items
 *     tags: [Baggage]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [lost, found, claimed]
 *         description: Filter by status
 *       - in: query
 *         name: bagType
 *         schema:
 *           type: string
 *           enum: [suitcase, backpack, handbag, laptop_bag, other]
 *         description: Filter by baggage type
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filter by color
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand
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
 *         description: List of baggage items
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
 *                     $ref: '#/components/schemas/Baggage'
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
 * /api/baggage/{id}:
 *   get:
 *     summary: Get a baggage item by ID
 *     tags: [Baggage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Baggage item ID
 *     responses:
 *       200:
 *         description: Baggage item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Baggage'
 *       404:
 *         description: Baggage item not found
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
 * /api/baggage:
 *   post:
 *     summary: Create a new baggage record
 *     tags: [Baggage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ownerName
 *               - description
 *             properties:
 *               ownerName:
 *                 type: string
 *               description:
 *                 type: string
 *               bagType:
 *                 type: string
 *                 enum: [suitcase, backpack, handbag, laptop_bag, other]
 *               color:
 *                 type: string
 *               brand:
 *                 type: string
 *               flightNumber:
 *                 type: string
 *               seatNumber:
 *                 type: string
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
 *     responses:
 *       201:
 *         description: Baggage item created successfully
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
 *                   example: Baggage item created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Baggage'
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
 * /api/baggage/{id}:
 *   put:
 *     summary: Update a baggage item
 *     tags: [Baggage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Baggage item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerName:
 *                 type: string
 *               description:
 *                 type: string
 *               bagType:
 *                 type: string
 *                 enum: [suitcase, backpack, handbag, laptop_bag, other]
 *               color:
 *                 type: string
 *               brand:
 *                 type: string
 *               flightNumber:
 *                 type: string
 *               seatNumber:
 *                 type: string
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
 *     responses:
 *       200:
 *         description: Baggage item updated successfully
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
 *                   example: Baggage item updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Baggage'
 *       404:
 *         description: Baggage item not found
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
 * /api/baggage/{id}:
 *   delete:
 *     summary: Delete a baggage item
 *     tags: [Baggage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Baggage item ID
 *     responses:
 *       200:
 *         description: Baggage item deleted successfully
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
 *                   example: Baggage item deleted successfully
 *       404:
 *         description: Baggage item not found
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
