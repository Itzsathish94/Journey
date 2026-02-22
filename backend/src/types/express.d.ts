import { UserPayload } from './types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}

// Override Passport's empty Express.User so req.user has id, email, role
declare global {
  namespace Express {
    interface User extends UserPayload {}
  }
}
