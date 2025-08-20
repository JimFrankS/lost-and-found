import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { ENV } from "./env.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lost and Found API",
      version: "1.0.0",
      description: "Comprehensive API documentation for Lost and Found backend system. This API manages lost items, found items, and their recovery process.",
      contact: {
        name: "Lost and Found Team",
        email: "support@lostandfound.com"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      { 
        url: `http://localhost:${ENV.PORT}`,
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        // Common schemas for all document types
        Document: {
          type: "object",
          properties: {
            _id: { type: "string", description: "MongoDB ObjectId" },
            documentType: { type: "string", enum: ["passport", "national_id", "drivers_license", "birth_certificate", "school_certificate", "baggage"] },
            fullName: { type: "string", description: "Full name of the document holder" },
            dateOfBirth: { type: "string", format: "date", description: "Date of birth in YYYY-MM-DD format" },
            documentNumber: { type: "string", description: "Unique document number" },
            issueDate: { type: "string", format: "date", description: "Document issue date" },
            expiryDate: { type: "string", format: "date", description: "Document expiry date" },
            placeOfIssue: { type: "string", description: "Place where document was issued" },
            nationality: { type: "string", description: "Nationality of the document holder" },
            contactInfo: {
              type: "object",
              properties: {
                email: { type: "string", format: "email" },
                phone: { type: "string" },
                address: { type: "string" }
              }
            },
            status: { type: "string", enum: ["lost", "found", "claimed"], default: "lost" },
            description: { type: "string", description: "Additional description or notes" },
            locationFound: { type: "string", description: "Location where item was found" },
            dateFound: { type: "string", format: "date-time", description: "Date and time when item was found" },
            reportedBy: { type: "string", description: "User who reported the item" },
            images: {
              type: "array",
              items: { type: "string" },
              description: "Array of image URLs"
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
            error: { type: "object" }
          }
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" }
          }
        }
      }
    }
  },
  apis: [
    "./src/routes/*.js",
    "./src/controllers/*.js",
    "./src/models/*.js",
    "./src/docs/*.js"
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerDocs = (app, port) => {
  // Swagger page
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Docs in JSON format
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  
  console.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
};

export default swaggerDocs;
