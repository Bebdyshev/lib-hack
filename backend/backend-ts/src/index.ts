import 'dotenv/config';
import express from 'express';
import cors from 'cors';  // Import cors
import connectDB from './db';
import globalRouter from './routes/global_router';
import { logger } from './logger';
import BooksService from './routes/books/books_service';
import BooksController from './routes/books/books_controller';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Configure CORS
const corsOptions = {
  origin: '*',  // Allow all origins, you can restrict this to specific domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
};

app.use(cors(corsOptions));  // Use CORS middleware
app.use(logger);
app.use(express.json());
app.use('/', globalRouter);

app.get('/', (request, response) => {
  response.send("Hello World!");
});

const some = async () => {
  const service = new BooksService();
  const controller = new BooksController(service);
  await controller.saveBooksFromJson();
}

// some()

app.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});
