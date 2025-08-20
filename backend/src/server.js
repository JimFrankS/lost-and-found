import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import { ENV } from "./config/env.js"; 
import { connectDB } from "./config/db.js";
import passportRoutes from "./routes/passport.route.js";
import natIdRoutes from "./routes/natId.route.js";
import dLicenceRoutes from "./routes/dLicence.route.js";
import sCertificateRoutes from "./routes/scertificate.route.js";
import bCertificateRoutes from "./routes/bcertificate.route.js";
import baggageRoutes from "./routes/baggage.route.js";

import { ensureStatsInitialized } from "./utility/stats.utility.js";

import attachRequestId from "./middleware/attachRequestId.middleware.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import notFound from "./middleware/notFound.middleware.js";

import logger, { loggerStream } from "./utility/logger.utility.js";
import swaggerDocs from "./config/swagger.js";

const app = express();
app.use(attachRequestId); 


app.use(helmet()); 


const corsOptions = {
    origin: ENV.NODE_ENV === 'production' ? ['https://your-frontend-app.com'] : '*',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); 

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	standardHeaders: true,
	legacyHeaders: false, 
});
app.use(limiter);

// Only use morgan for HTTP request logging in non-test environments
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: loggerStream }));
}
app.use(express.json({ limit: '10kb' })); // Limit request body size

app.get("/", (req, res) => res.send("Hello Smank, from server")) 

app.use("/api/passport", passportRoutes);
app.use("/api/natId", natIdRoutes);
app.use("/api/dLicence", dLicenceRoutes);
app.use("/api/sCertificate", sCertificateRoutes); 
app.use("/api/bCertificate", bCertificateRoutes);
app.use("/api/baggage", baggageRoutes);

// Health check endpoint
app.get("/health", (req, res) => res.status(200).json({ 
    status: "ok", 
    uptime: process.uptime() 
}));

// Initialize Swagger documentation
swaggerDocs(app, ENV.PORT);

app.use(notFound); // Catch-all for 404 Not Found
app.use(errorHandler); // Global error handler

let server;

const startServer = async () => {
    try {
        await connectDB();
        const stats = await ensureStatsInitialized();
        logger.info('Initial stats loaded', {
            totalDocuments: stats.totalDocuments,
            claimedDocuments: stats.claimedDocuments
        });
        server = app.listen(ENV.PORT, () =>
            logger.info(`Server is running on port ${ENV.PORT}`)
        );
    } catch (error) {
        logger.error("Error starting server:", error);
        process.exit(1); 
    }
};

const gracefulShutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    // Fallback timeout to ensure the process exits even if shutdown hangs
    const timeout = setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000); // 10 seconds

    const closeMongooseConnection = () => {
        mongoose.connection.close(false, (err) => {
            if (err) {
                logger.error('Error closing MongoDB connection:', err);
                process.exit(1);
            }
            logger.info('MongoDB connection closed.');
            clearTimeout(timeout);
            process.exit(0);
        });
    };

    if (server) {
        server.close((err) => {
            if (err) {
                logger.error('Error closing HTTP server:', err);
                return process.exit(1);
            }
            logger.info('HTTP server closed.');
            closeMongooseConnection();
        });
    } else {
        logger.info('HTTP server not started, shutting down MongoDB directly.');
        closeMongooseConnection();
    }
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Only start the server if the file is run directly (i.e. not imported by a test runner)
if (process.env.JEST_WORKER_ID === undefined) {
  startServer();
}

export default app; // Export for testing purposes