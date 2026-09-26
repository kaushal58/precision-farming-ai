import { Router } from 'express';
import * as cropCtrl from '../controllers/crop.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', cropCtrl.getCrops);
router.post('/', cropCtrl.createCrop);
router.put('/:id', cropCtrl.updateCrop);
router.delete('/:id', cropCtrl.deleteCrop);

export default router;
