import { Request, Response } from 'express';
import { CreateBooks } from './dtos/CreateBooks.dto'; 
import BooksService from './books_service';
import Books, { IBooks } from './models/Books';
import data from "../../../data.json"

class BooksController {
  private booksService: BooksService;

  constructor(booksService: BooksService) {
    this.booksService = booksService;
  }

  postBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const createBooks: CreateBooks = req.body;
      const user = (req as any).user 
      const book: IBooks = await this.booksService.saveBook(createBooks, user._id);
      res.status(201).json(book);
    } catch (err) {
      console.error('Error creating book:', err);
      res.status(500).json({ message: 'Failed to create book', error: err });
    }
  }

  LikeBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user
      const {bookId} = req.query
      await this.booksService.likeBook(user._id, bookId as string);
      res.status(201).json({message: "success"});
    } catch (err) {
      console.error('Error creating book:', err);
      res.status(500).json({ message: 'Failed to create book', error: err });
    }
  }

  DislikeBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user
      const {bookId} = req.query
      await this.booksService.dislikeBook(user._id, bookId as string);
      res.status(201).json({message: "success"});
    } catch (err) {
      console.error('Error creating book:', err);
      res.status(500).json({ message: 'Failed to create book', error: err });
    }
  }

  ViewBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user
      const {bookId} = req.query
      await this.booksService.viewBook(user._id, bookId as string);
      res.status(201).json({message: "success"});
    } catch (err) {
      console.error('Error creating book:', err);
      res.status(500).json({ message: 'Failed to create book', error: err });
    }
  }

  GetFirstRecomendation = async (req: Request, res: Response) => {
    try{
      const user = (req as any).user 
      const recomendations = await this.booksService.recommendBooksInit(user._id)
      if(recomendations.error){
        console.log(recomendations.error)
        res.status(500).send(recomendations.error)
        return 
      }
      res.status(200).send(recomendations)
    }catch(err){
      console.log(err)
      res.status(400).send(err)
    }
  }

  GetFollowingRecomendations = async (req: Request, res: Response) => {
    try{
      const user = (req as any).user 
      const {boodId} = req.query 
      const recomendations = await this.booksService.generateFollowingRecommendations(user._id, boodId as string)
      res.status(200).send(recomendations)
    }catch(err){
      console.log(err)
      res.status(400).send(err)
    }
  }

  GetMatches = async(req: Request, res: Response) => {
    try{
      const user = (req as any).user 
      const matches = await this.booksService.myMatches(user._id)
      res.status(200).send(matches)
    }catch(err){
      console.log(err)
      res.status(400).send(err)
    }
  }

  searchBooks = async (req: Request, res: Response) => {
    try {
        const { query = '', page = 1, limit = 10 } = req.query;
        
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        
        if (isNaN(pageNumber) || pageNumber <= 0) {
            return res.status(400).json({ error: 'Invalid page number' });
        }
        if (isNaN(limitNumber) || limitNumber <= 0) {
            return res.status(400).json({ error: 'Invalid limit number' });
        }
        
        const results = await Books.search(query as string, pageNumber, limitNumber);
        
        res.status(200).json(results);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ error: 'An error occurred while searching for books' });
    }
};

  AcceptMatch = async(req: Request, res: Response) => {
    try{
      const user = (req as any).user 
      const {matchId} = req.query
      await this.booksService.acceptMatch(user._id, matchId as string)
      res.status(200).send({message: "success"})
    }catch(err){
      console.log(err)
      res.status(400).send(err)
    }
  }

  DeclineMatch = async(req: Request, res: Response) => {
    try{
      const user = (req as any).user 
      const {matchId} = req.query
      await this.booksService.declineMatch(user._id, matchId as string)
      res.status(200).send({message: "success"})
    }catch(err){
      console.log(err)
      res.status(400).send(err)
    }
  }

  trending = async(req: Request, res: Response) => {
    try{
      const resp = await this.booksService.getTrendingAndMostLikedBooks()
      res.status(200).send(resp)
    }catch(err){
      console.log(err)
      res.status(400).send(err)
    }
  }

  getMyBooks = async(req: Request, res: Response) => {
    try{
      const user = (req as any).user 
      const books = await this.booksService.GetUsersBooks(user._id)
      res.status(200).send(books)
    }catch(err){
      console.log(err)
      res.status(400).send(err)
    }
  }

  GetBooksReservationInformation = async (req: Request, res: Response) => {
    try{
      const {bookId} = req.query
      const reservs = await this.booksService.GetBooksReservsInformation(bookId as string)
      res.status(200).send(reservs)
    }catch(err){
      res.status(400).send({message: err})
    }
  }

  ReservABook = async (req: Request, res: Response) => {
    try{
      const user = (req as any).user 
      const {bookId} = req.query
      const reservation = await this.booksService.ReservABook(user._id, bookId as string)
      res.status(200).send(reservation)
    }catch(err){
      console.log(err)
      res.status(500).send({message: err})
    }
  }

  GetUsersReservations = async(req: Request, res: Response) => {
    try{
      const user = (req as any).user 
      const reservations = await this.booksService.GetMyBooksReservations(user._id)
      res.status(200).send(reservations)
    }catch(err){
      console.log(err)
      res.status(400).send({message: err})
    }
  }

  InvalidateReservation = async(req: Request, res: Response) => {
    try{
      const user = (req as any).user 
      const role = user.role

      const {reservationId, action} = req.query 
      await this.booksService.InvalidateOrCompleteReservation(reservationId as string, user._id, action as "invalid"|"done" || "invalid")
    }catch(err){
      res.status(400).send({message: err})
    }
  }

  saveBooksFromJson = async () => {
    const parsedData = data as BookData;
  
    for (const categoryKey in parsedData) {
      const categoryBooks = parsedData[categoryKey]; 
  
      if (Array.isArray(categoryBooks)) {
        categoryBooks.forEach(async (book: Book) => {
          if (has20PercentChance()) {
            const newBook: CreateBooks = {
              title: book.title,
              author: book.author,
              media_urls: [book.media_urls],
              description: book.description,
              is_from_library: true
            }
  
            await this.booksService.saveBook(newBook, "66dbe71c5a4f7e25bc510392")
          }else{
            const newBook: CreateBooks = {
              title: book.title,
              author: book.author,
              media_urls: [book.media_urls],
              description: book.description,
              is_from_library: false
            }
  
            await this.booksService.saveBook(newBook, "66dae0412113509f5a50821e")
          }
          
          }
        );
      }
    }
  };
}

export default BooksController;


type Book = {
  title: string;
  author: string;
  description: string;
  media_urls: string;
};

type BookData = {
  [key: string]: Book[];  // Allow dynamic keys (category_2, category_3, etc.)
};

const has20PercentChance = (): boolean => {
  return Math.random() < 0.5;
}