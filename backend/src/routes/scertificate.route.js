import express from "express";
import { claimScertificate, foundScertificate } from "../controllers/scertificate.controller.js";
import {sanitizeInput} from "../middleware/sanitizeInput.middleware.js";

const router = express.Router();

router.post("/found", sanitizeInput, foundScertificate);
router.get("/claim", sanitizeInput, claimScertificate);

export default router;