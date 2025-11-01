import express from "express";
import { claimbCertificate, foundbCertificate, viewbCertificate } from "../controllers/bcertificate.controller.js";
import {sanitizeInput} from "../middleware/sanitizeInput.middleware.js";

const router = express.Router();

router.post("/found", sanitizeInput, foundbCertificate);
router.get("/claim", sanitizeInput, claimbCertificate);
router.get("/view/:id", sanitizeInput, viewbCertificate);

export default router;
