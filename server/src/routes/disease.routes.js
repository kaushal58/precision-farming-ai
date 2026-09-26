import { Router } from 'express';
import * as diseaseCtrl from '../controllers/disease.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.use(protect);
router.post('/analyze', upload.single('image'), diseaseCtrl.analyzeDisease);
router.get('/history', diseaseCtrl.getHistory);
router.get('/:id', diseaseCtrl.getReport);

export default router;
