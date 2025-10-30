import express from "express";
import { claimLicence, foundLicence, searchDLicence } from "../controllers/dLicence.controller.js";
import { sanitizeInput } from "../middleware/sanitizeInput.middleware.js";

const router = express.Router();

router.post("/found", sanitizeInput, foundLicence);
router.get("/search", sanitizeInput, searchDLicence);
router.get("/claim/:identifier", sanitizeInput, claimLicence);

export default router;