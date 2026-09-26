import { Router } from 'express';
import * as reportCtrl from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/pdf', reportCtrl.generateFarmReport);

export default router;
