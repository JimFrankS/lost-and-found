import express from "express";
import { claimPassport, lostPassport } from "../controllers/passport.controller.js";
import {sanitizeInput} from "../middleware/sanitizeInput.middleware.js";

const router = express.Router();

router.get("/claim/:identifier", sanitizeInput, claimPassport); 
router.post("/lost", sanitizeInput, lostPassport);

export default router;