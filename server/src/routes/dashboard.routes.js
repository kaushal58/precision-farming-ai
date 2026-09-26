import { Router } from 'express';
import * as dashboardCtrl from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', dashboardCtrl.getDashboard);

export default router;
