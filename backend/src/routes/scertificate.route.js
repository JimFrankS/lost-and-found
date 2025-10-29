import express from "express";
import { searchScertificate, foundScertificate, viewScertificate } from "../controllers/scertificate.controller.js";
import {sanitizeInput} from "../middleware/sanitizeInput.middleware.js";

const router = express.Router();

router.post("/found", sanitizeInput, foundScertificate);
router.get("/search", sanitizeInput, searchScertificate);
router.get("/view/:id", sanitizeInput, viewScertificate);

export default router;