import express from 'express';
import { lostBaggage, searchBaggage, viewBaggage, claimBaggage } from '../controllers/mBaggage.controller.js';
import { sanitizeInput } from '../middleware/sanitizeInput.middleware.js';
import { provinceValidator } from '../middleware/destinationValidator.middleware.js';

const router = express.Router();

router.post("/found", sanitizeInput, provinceValidator, lostBaggage);
router.get("/search", sanitizeInput, provinceValidator, searchBaggage);
router.get("/view/:id", sanitizeInput, viewBaggage);
router.get("/claim/:id", sanitizeInput, claimBaggage);

export default router;