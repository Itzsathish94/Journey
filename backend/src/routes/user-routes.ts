import { Router } from 'express';
import { userController } from '../config/dependency-injector';
import { authenticate } from '../middlewares/authenticated-routes';
import { isUser } from '../middlewares/role-auth';

const router = Router();

router.get(
  '/placeholder',
  authenticate,
  isUser,
  userController.placeholder.bind(userController)
);

export default router;
