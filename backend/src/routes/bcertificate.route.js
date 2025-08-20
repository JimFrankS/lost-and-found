import express from "express";
import { claimbCertificate, foundbCertificate } from "../controllers/bcertificate.controller.js";
import {sanitizeInput} from "../middleware/sanitizeInput.middleware.js";

const router = express.Router();

router.post("/found", sanitizeInput, foundbCertificate);
router.get("/claim", sanitizeInput, claimbCertificate);

export default router;