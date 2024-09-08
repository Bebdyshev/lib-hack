import { Router } from 'express';
import authMiddleware from '../../middlewares/auth-middleware';
import BooksController from './books_controller';
import BooksService from './books_service';

const booksRouter = Router();

const booksService = new BooksService();
const booksController = new BooksController(booksService);

booksRouter.post('/create_book', authMiddleware, booksController.postBooks);
booksRouter.post("/like", authMiddleware, booksController.LikeBook)
booksRouter.post("/dislike", authMiddleware, booksController.DislikeBook)
booksRouter.post("/view", authMiddleware, booksController.ViewBook)
booksRouter.get("/recomendation/init", authMiddleware, booksController.GetFirstRecomendation)
booksRouter.get("/recomendation/following", authMiddleware, booksController.GetFollowingRecomendations)
booksRouter.get("/trending", booksController.trending) // Get most liked of all time, recently trending and latest.
booksRouter.post("/reserv", authMiddleware, booksController.ReservABook) 
booksRouter.get("/reserv-information", booksController.GetBooksReservationInformation) 
booksRouter.get("/reserv-information/my", authMiddleware, booksController.GetUsersReservations) 
booksRouter.patch("/reserv") 
booksRouter.post("/reserv/invalidate", authMiddleware, booksController.InvalidateReservation)
booksRouter.get("/matches/my", authMiddleware, booksController.GetMatches) 
booksRouter.post("/matches/accept", authMiddleware, booksController.AcceptMatch)
booksRouter.post("/matches/decline", authMiddleware, booksController.DeclineMatch)
booksRouter.get("/my", authMiddleware)


booksRouter.get("/search", booksController.searchBooks)

booksRouter.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You have access to this route!' });
});

export default booksRouter;

// 