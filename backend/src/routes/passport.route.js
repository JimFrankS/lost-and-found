import express from "express";
import { claimPassport, lostPassport, searchPassport } from "../controllers/passport.controller.js";
import {sanitizeInput} from "../middleware/sanitizeInput.middleware.js";

const router = express.Router();

router.get("/search", sanitizeInput, searchPassport);
router.get("/claim/:identifier", sanitizeInput, claimPassport);
router.post("/lost", sanitizeInput, lostPassport);

export default router;
