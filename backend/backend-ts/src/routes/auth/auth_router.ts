import { Router } from 'express';
import authMiddleware from '../../middlewares/auth-middleware';
import AuthController from './auth_controller';
import AuthService from './auth_service';

const authRouter = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

authRouter.post('/register', authController.registerUser);
authRouter.post('/login', authController.loginUser);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.get("/me", authMiddleware, authController.me)

authRouter.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You have access to this route!' });
});

export default authRouter;