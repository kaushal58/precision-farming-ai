import { Router } from 'express';
import * as adminCtrl from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect, authorize('admin'));
router.get('/stats', adminCtrl.getStats);
router.get('/users', adminCtrl.getUsers);
router.patch('/users/:id', adminCtrl.updateUser);
router.delete('/users/:id', adminCtrl.deleteUser);

export default router;
