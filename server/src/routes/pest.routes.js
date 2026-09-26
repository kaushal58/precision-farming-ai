import { Router } from 'express';
import * as pestCtrl from '../controllers/pest.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.use(protect);
router.post('/detect', upload.single('image'), pestCtrl.detectPest);
router.get('/history', pestCtrl.getPestHistory);

export default router;
