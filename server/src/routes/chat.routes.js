import { Router } from 'express';
import * as chatCtrl from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.post('/message', chatCtrl.sendMessage);
router.get('/history', chatCtrl.getHistory);

export default router;
