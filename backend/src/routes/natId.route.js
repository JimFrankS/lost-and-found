import express from "express";
import { foundId, claimId } from "../controllers/natId.controller.js";
import {sanitizeInput} from "../middleware/sanitizeInput.middleware.js";


const router = express.Router();

router.post("/found", sanitizeInput, foundId);
router.get("/claim/:identifier", sanitizeInput, claimId);

export default router;