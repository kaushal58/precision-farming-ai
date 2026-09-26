import { Router } from 'express';
import * as userCtrl from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.put('/profile', userCtrl.updateProfile);
router.put('/password', userCtrl.changePassword);

export default router;
