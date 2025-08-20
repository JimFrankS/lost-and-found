import express from "express";
import { claimLicence, foundLicence } from "../controllers/dLicence.controller.js";
import sanitizeInput from "../middleware/sanitizeInput.middleware.js";

const router = express.Router();

router.post("/found", sanitizeInput, foundLicence);
router.get("/claim/:identifier", sanitizeInput, claimLicence);

export default router;