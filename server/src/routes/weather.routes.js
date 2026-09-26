import { Router } from 'express';
import * as weatherCtrl from '../controllers/weather.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', weatherCtrl.getWeather);

export default router;
