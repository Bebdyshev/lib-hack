import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../routes/auth/models/User';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[0];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    (req as any).user = user;
    next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;