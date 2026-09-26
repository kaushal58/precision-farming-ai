import { Router } from 'express';
import * as irrigationCtrl from '../controllers/irrigation.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.post('/predict', irrigationCtrl.predictIrrigation);
router.get('/history', irrigationCtrl.getIrrigationHistory);

export default router;
