import { Router } from 'express';
import { body } from 'express-validator';
import * as authCtrl from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  authCtrl.register
);
router.post('/login', [body('email').trim().normalizeEmail().isEmail(), body('password').notEmpty()], authCtrl.login);
router.post('/forgot-password', [body('email').isEmail()], authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);
router.get('/me', protect, authCtrl.getMe);

export default router;
