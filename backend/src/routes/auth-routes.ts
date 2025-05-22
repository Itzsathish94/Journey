import { Router } from 'express';
import { authController } from '../config/dependency-injector';

const router = Router();

router.post('/signup', authController.userSignUp.bind(authController));
router.post('/verify', authController.createUser.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/refresh', authController.refreshAccessToken.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.post('/clear-tokens', authController.clearAllTokens.bind(authController));

export default router;