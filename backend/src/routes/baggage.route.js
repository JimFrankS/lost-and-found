import express from 'express';
import { lostBaggage, claimBaggage } from '../controllers/baggage.controller.js';
import { sanitizeInput } from '../middleware/sanitizeInput.middleware.js';
import { provinceValidator } from '../middleware/destinationValidator.middleware.js';

const router = express.Router();

router.post("/found", sanitizeInput, provinceValidator, lostBaggage);
router.get("/claim", sanitizeInput, provinceValidator, claimBaggage);

export default router;