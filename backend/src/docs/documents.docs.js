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
 *         fullName:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         idNumber:
 *           type: string
 *         issueDate:
 *           type: string
 *           format: date
 *         expiryDate:
 *           type: string
 *           format: date
 *         placeOfIssue:
 *           type: string
 *         nationality:
 *           type: string
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
 *         description:
 *           type: string
 *         locationFound:
 *           type: string
 *         dateFound:
 *           type: string
 *           format: date-time
 *         reportedBy:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     DriversLicense:
 *       type: object
 *       required:
 *         - fullName
 *         - dateOfBirth
 *         - licenseNumber
 *       properties:
 *         _id:
 *           type: string
 *         fullName:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         licenseNumber:
 *           type: string
 *         issueDate:
 *           type: string
 *           format: date
 *         expiryDate:
 *           type: string
 *           format: date
 *         placeOfIssue:
 *           type: string
 *         nationality:
 *           type: string
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
 *         description:
 *           type: string
 *         locationFound:
 *           type: string
 *         dateFound:
 *           type: string
 *           format: date-time
 *         reportedBy:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     BirthCertificate:
 *       type: object
 *       required:
 *         - fullName
 *         - dateOfBirth
 *         - certificateNumber
 *       properties:
 *         _id:
 *           type: string
 *         fullName:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         certificateNumber:
 *           type: string
 *         placeOfBirth:
 *           type: string
 *         fatherName:
 *           type: string
 *         motherName:
 *           type: string
 *         issueDate:
 *           type: string
 *           format: date
 *         placeOfIssue:
 *           type: string
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
 *         description:
 *           type: string
 *         locationFound:
 *           type: string
 *         dateFound:
 *           type: string
 *           format: date-time
 *         reportedBy:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
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
 *         fullName:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         certificateNumber:
 *           type: string
 *         schoolName:
 *           type: string
 *         grade:
 *           type: string
 *         yearOfCompletion:
 *           type: string
 *         issueDate:
 *           type: string
 *           format: date
 *         placeOfIssue:
 *           type: string
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
 *         description:
 *           type: string
 *         locationFound:
 *           type: string
 *         dateFound:
 *           type: string
 *           format: date-time
 *         reportedBy:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Baggage:
 *       type: object
 *       required:
 *         - ownerName
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *         ownerName:
 *           type: string
 *         description:
 *           type: string
 *         bagType:
 *           type: string
 *           enum: [suitcase, backpack, handbag, laptop_bag, other]
 *         color:
 *           type: string
 *         brand:
 *           type: string
 *         flightNumber:
 *           type: string
 *         seatNumber:
 *           type: string
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
 *         locationFound:
 *           type: string
 *         dateFound:
 *           type: string
 *           format: date-time
 *         reportedBy:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
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
 *   - name: National ID
 *     description: API endpoints for managing lost and found national ID cards
 *   - name: Driver's License
 *     description: API endpoints for managing lost and found driver's licenses
 *   - name: Birth Certificate
 *     description: API endpoints for managing lost and found birth certificates
 *   - name: School Certificate
 *     description: API endpoints for managing lost and found school certificates
 *   - name: Baggage
 *     description: API endpoints for managing lost and found baggage items
 */

export default {};
