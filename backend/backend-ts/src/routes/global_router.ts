import { Router } from 'express';
import authRouter from './auth/auth_router';
import awsRouter from './aws/aws_router';
import booksRouter from './books/books_router';

const globalRouter = Router();


globalRouter.use("/auth",authRouter);
globalRouter.use("/aws",awsRouter);
globalRouter.use("/books", booksRouter);


export default globalRouter;