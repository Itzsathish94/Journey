import { Router } from 'express';
import { userController } from '../config/dependency-injector';
import { authenticate } from '../middlewares/authenticated-routes';
import { isUser } from '../middlewares/role-auth';
import { Request } from 'express';

const router = Router();

router.get(
  '/placeholder',authenticate,isUser,
  userController.placeholder.bind(userController)
);

router.get('/print',printReq)

function printReq(req:Request){
  console.log(req.user)
}

export default router;
