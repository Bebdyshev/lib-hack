import dotenv from 'dotenv';
import { CreateBooks } from './dtos/CreateBooks.dto';
import Books, { IBooks } from './models/Books';
import Likes, { ILikes } from "./models/Likes"
import Dislikes, { IDislikes } from "./models/Dislikes"
import Views, { IViewd } from "./models/Viewed"
import Viewed from './models/Viewed';
import { IRecommendationResult, IRecommendations } from './types/books-types';
import { Document, Types } from 'mongoose';
import Matches, { IMatches } from "./models/Match"
import Reservations from "./models/Reserve"
import Users from "../auth/models/User"
import data from "../../../data.json"

dotenv.config();

class BooksService {
    async saveBook(createBooksDto: CreateBooks, author_id: string): Promise<IBooks> {
        const { media_urls, title, description, is_from_library, author } = createBooksDto;
    
        const existingBook = await Books.findOne({ title, author }).exec(); 
    
        if (existingBook) {
            return existingBook;
        }
    
        const newBook = new Books({
            media_urls,
            title,
            description,
            author_id,
            is_from_library,
            author
        });
    
        await newBook.save();
    
        return newBook;
    }
    

    async viewBook(user_id: string, book_id: string) {
        const book = await Books.findById(book_id);
        if (!book) {
            throw new Error('Book not found');
        }

        const alreadyViewed = await Views.findOne({ user_id, book_id });
        if (alreadyViewed) {
            throw new Error('User has already viewed this book');
        }

        const newViewed = new Viewed({
            user_id,
            book_id
        });

        await newViewed.save();

        await Books.findByIdAndUpdate(book_id, { $inc: { number_views: 1 } });
    }

    
    async likeBook(user_id: string, book_id: string) {
        const book = await Books.findById(book_id);
        if (!book) {
            throw new Error('Book not found');
        }
    
        const existingLike = await Likes.findOne({ user_id, book_id });
        if (existingLike) {
            throw new Error('User has already liked this book');
        }
    
        const newLike = new Likes({
            user_id,
            book_id
        });
    
        await newLike.save();
    
        await Books.findByIdAndUpdate(book_id, { $inc: { number_likes: 1 } });
    
        if (user_id === book.author_id) {
            return; // User is the author, no match should be created
        }
    
        // Check if the author has liked any books from the user
        const userBooks = await Books.find({ author_id: user_id });
        
        if (userBooks.length === 0) {
            return; // No books from the user, no match possible
        }
    
        const authorLikesUserBook = await Likes.findOne({
            user_id: book.author_id, 
            book_id: { $in: userBooks.map(b => b._id) }
        }).exec();
    
        if (authorLikesUserBook) {
            // Avoid creating a match if both users are the same (double check)
            if (user_id !== book.author_id) { // Ensure author is different
                const newMatch = new Matches({
                    first_user_id: user_id,
                    second_user_id: book.author_id, // Make sure this is the author
                    first_book_id: book_id,
                    second_book_id: authorLikesUserBook.book_id,
                    accepted_by_first: false,
                    accepted_by_second: false
                });
    
                await newMatch.save();
            }
        }
    }
    
    

    async dislikeBook(user_id: string, book_id: string) {
        const book = await Books.findById(book_id);
        if (!book) {
            throw new Error('Book not found');
        }

        const existingDislike = await Dislikes.findOne({ user_id, book_id });
        if (existingDislike) {
            throw new Error('User has already disliked this book');
        }

        const newDislike = new Dislikes({
            user_id,
            book_id
        });

        await newDislike.save();
    }

    async getTrendingAndMostLikedBooks() {
        const currentDate = new Date();
        const previousDay = new Date();
        previousDay.setDate(currentDate.getDate() - 1);
      
        try {
          const trendingBooks = await Books.aggregate([
            {
              $match: {
                createdAt: { $gte: previousDay, $lt: currentDate },
              },
            },
            {
              $sort: { number_likes: -1 },
            },
            {
              $limit: 10,
            },
          ]);
      
          const mostLikedBooks = await Books.find({})
            .sort({ number_likes: -1 })
            .limit(10);

        const mostViewedBooks = await Books.find({})
            .sort({ number_views: -1 })
            .limit(10);
      
          return {trending: trendingBooks, liked: mostLikedBooks, viewed: mostViewedBooks}
      
        } catch (error) {
          console.error('Error fetching books:', error);
        }
      }

      async myMatches(user_id: string): Promise<{
        acceptedMatches: IMatches[],
        waitingForOtherToAccept: IMatches[],
        waitingForUserToAccept: IMatches[]
      }> {
        try {
          const matches = await Matches.find({
            $or: [
              { first_user_id: user_id },
              { second_user_id: user_id }
            ]
          })
            .populate('first_user_id')
            .populate('second_user_id')
            .populate('first_book_id')
            .populate('second_book_id')
            .exec();
      
          // Classify matches
          const acceptedMatches: IMatches[] = [];
          const waitingForOtherToAccept: IMatches[] = [];
          const waitingForUserToAccept: IMatches[] = [];
      
          matches.forEach((match) => {
            const isFirstUser = (match.first_user_id as any)._id.toString() === user_id.toString();
      
            const userAccepted = isFirstUser ? match.accepted_by_first : match.accepted_by_second;
            const otherUserAccepted = isFirstUser ? match.accepted_by_second : match.accepted_by_first;

            // Accepted by both users
            if (userAccepted && otherUserAccepted) {
              acceptedMatches.push(match);
            }
            // Waiting for another person to accept
            else if (!otherUserAccepted && userAccepted) {
              waitingForOtherToAccept.push(match);
            }
            // Waiting for the user to accept
            else{
              waitingForUserToAccept.push(match);
            }
          });
      
          return {
            acceptedMatches,
            waitingForOtherToAccept,
            waitingForUserToAccept
          };
        } catch (error) {
          console.error('Error fetching matches:', error);
          throw new Error('Error fetching matches');
        }
      }
      

    async acceptMatch(user_id: string, match_id: string) {
        try {
            const match = await Matches.findById(match_id).exec();
    
            if (!match) {
                throw new Error("Match not found");
            }
            const { first_user_id, second_user_id } = match;
            if (String(first_user_id) === String(user_id)) {
                match.accepted_by_first = true;
            } else if (String(second_user_id) === String(user_id)) {
                match.accepted_by_second = true;
            } else {
                // Handle the error gracefully
                console.error("User not part of this match");
                throw new Error("User not part of this match");
            }
    
            await match.save();
    
            return { success: true, message: "Match accepted" };
    
        } catch (err) {
            console.error(err);
            throw new Error("Error accepting match");
        }
    }

    async declineMatch(user_id: string, match_id: string) {
        try {
            const match = await Matches.findById(match_id).exec();
    
            if (!match) {
                throw new Error("Match not found");
            }
    
            if (match.first_user_id === user_id) {
                match.accepted_by_first = false;
            } else if (match.second_user_id === user_id) {
                match.accepted_by_second = false;
            } else {
                throw new Error("User not part of this match");
            }
    
            await match.save();
    
            return { success: true, message: "Match declined" };
    
        } catch (err) {
            console.error(err);
            throw new Error("Error accepting match");
        }
    }


    async GetBooksReservsInformation(book_id: string) {
        try {
            const reservs = await Reservations.find({ book_id })
                .populate('user_id')  
                .populate('book_id')  
                .exec();
    
            if (!reservs || reservs.length === 0) {
                return []
            }
    
            return reservs;
    
        } catch (err) {
            console.error(err);
            throw new Error("Error fetching reservation information");
        }
    }
    
    async GetUsersBooks(user_id: string){
        try{
            const books = await Books.find({author_id: user_id}).exec()
            return books 
        }catch(err){
            throw err 
        }
    }

    async GetMyBooksReservations(user_id: string){
        try{
            const reservs = await Reservations.find({user_id}).populate('book_id').exec()
            return reservs
        }catch(err){
            throw err
        }
    }

    async ReservABook(user_id: string, book_id: string) {
        try {
            const existingReservation = await Reservations.findOne({ user_id, book_id }).exec();
    
            if (existingReservation) {
                throw new Error("User has already reserved this book.")
            }

            const book = await Books.findById(book_id).exec()
            if (!book?.is_from_library){
                throw new Error("This book can't be reserved")
            }
    
            const currentReservations = await Reservations.countDocuments({ book_id }).exec();
            const queue_position = currentReservations + 1; 
    
            const newReservation = new Reservations({
                user_id,
                book_id,
                queue_position,
                status: queue_position === 1 ? 'active' : 'pending', 
                reserved_at: new Date()
            });
    
            await newReservation.save();
    
            return newReservation;
    
        } catch (err) {
            console.error(err);
            throw new Error("Error while reserving the book");
        }
    }

    async InvalidateOrCompleteReservation(reservation_id: string, user_id: string, action: 'invalid' | 'done') {
        try {
            // Fetch the user to check their role
            const user = await Users.findById(user_id).exec();
    
            if (!user) {
                return { success: false, message: "User not found." };
            }
    
            // Fetch the reservation
            const updatedReservation = await Reservations.findById(reservation_id).exec();
            if (!updatedReservation) {
                return { success: false, message: "Reservation not found." };
            }
    
            // Only the reservation creator or an admin can invalidate the reservation
            if (action === 'invalid') {
                console.log(updatedReservation.user_id.toString() , user_id.toString())
                if (updatedReservation.user_id.toString() !== user_id.toString() && user.role !== 'admin') {
                    throw new Error("You do not have permission to invalidate this reservation.")
                }
            }
    
            // Only admins can mark a reservation as done
            if (action === 'done' && user.role !== 'admin') {
                throw new Error("Only admins can mark reservations as done.")
            }
    
            // Update the reservation status
            updatedReservation.status = action;
            await updatedReservation.save();
    
            // If the reservation was 'active' and is being invalidated, promote the next in queue
            if (updatedReservation.status === 'active' && action === 'invalid') {
                const nextInQueue = await Reservations.findOne({
                    book_id: updatedReservation.book_id,
                    status: 'pending'
                }).sort({ queue_position: 1 }).exec(); // Find the next pending reservation
    
                if (nextInQueue) {
                    await Reservations.findByIdAndUpdate(
                        nextInQueue._id,
                        { status: 'active' }, // Promote the next reservation to 'active'
                        { new: true }
                    ).exec();
                }
            }
    
            return { success: true, message: `Reservation marked as ${action} successfully.` };
    
        } catch (err) {
            console.error(err);
            throw new Error("Error while updating the reservation.");
        }
    }
    
    async searchBooks(){
        try{

        }catch(err){

        }
    }
    
    
    
    
    

    async recommendBooksInit(userId: string): Promise<IRecommendationResult> {
        // Fetch user interactions (likes, dislikes, views)
        const userLikes = await Likes.aggregate([
            { $match: { user_id: new Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'books',
                    localField: 'book_id',
                    foreignField: '_id',
                    as: 'book'
                }
            }
        ]).exec();
    
        const userDislikes = await Dislikes.aggregate([
            { $match: { user_id: new Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'books',
                    localField: 'book_id',
                    foreignField: '_id',
                    as: 'book'
                }
            }
        ]).exec();
    
        const userViews = await Views.aggregate([
            { $match: { user_id: new Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'books',
                    localField: 'book_id',
                    foreignField: '_id',
                    as: 'book'
                }
            }
        ]).exec();
    
        // Extract the book IDs the user has interacted with
        const likedBookIds = userLikes.map((like: ILikes) => like.book_id);
        const dislikedBookIds = userDislikes.map((dislike: IDislikes) => dislike.book_id);
        const viewedBookIds = userViews.map((view: IViewd) => view.book_id);
    
        // Combine all book IDs into a unique set of interacted books
        const interactedBookIds = [...new Set([...likedBookIds, ...dislikedBookIds, ...viewedBookIds])].map(id => new Types.ObjectId(id));
    
        // Fetch a current book (a book the user hasn't interacted with and not authored by the user)
        let currentBook = await Books.aggregate([
            { $match: { 
                _id: { $nin: interactedBookIds },
                author_id: { $ne: new Types.ObjectId(userId) },  // Exclude books authored by the user
            } },
            { $sample: { size: 1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author_id',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            { $project: { 'author.password': 0 } }
        ]).exec();
    
        // If no current book is found, return a fallback
        if (currentBook.length === 0) {
            currentBook = await Books.aggregate([
                { $match: { 
                    _id: { $nin: interactedBookIds },
                    author_id: { $ne: new Types.ObjectId(userId) }
                                } },
                { $sample: { size: 1 } }
            ]).exec();
        }
    
        // Assuming you want to find users who liked the same books
        const similarUserLikes = await Likes.aggregate([
            { $match: { book_id: { $in: likedBookIds } } },
            { $group: { _id: '$user_id' } }
        ]).exec();
    
        const similarUserIds = similarUserLikes.map((like: any) => like._id);
    
        const currentBookId = currentBook[0]?._id;
    
        // Find a book to recommend if the user likes the current book
        let likeRecommendation = await Books.aggregate([
            { $match: { 
                _id: { $nin: interactedBookIds },
                author_id: { $ne: new Types.ObjectId(userId) }
            } },
            { $match: { 'likes.user_id': { $in: similarUserIds } } },
            { $sample: { size: 1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author_id',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            { $project: { 'author.password': 0 } }
        ]).exec();
    
        if (likeRecommendation.length === 0) {
            likeRecommendation = await Books.aggregate([
                { $match: { 
                    _id: { $nin: interactedBookIds },
                    author_id: { $ne: new Types.ObjectId(userId) }
                } },
                { $sample: { size: 1 } }
            ]).exec();
        }
    
        // Find a book to recommend if the user dislikes the current book
        let dislikeRecommendation = await Books.aggregate([
            { $match: { 
                _id: { $nin: interactedBookIds },
                author_id: { $ne: new Types.ObjectId(userId) },
            } },
            { $sample: { size: 1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author_id',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            { $project: { 'author.password': 0 } }
        ]).exec();
    
        if (dislikeRecommendation.length === 0) {
            dislikeRecommendation = await Books.aggregate([
                { $match: { 
                    _id: { $nin: interactedBookIds },
                    author_id: { $ne: new Types.ObjectId(userId) }
                } },
                { $sample: { size: 1 } }
            ]).exec();
        }
    
        // Return recommendations
        return {
            current: currentBook[0] || null,
            like: likeRecommendation[0] || null,
            dislike: dislikeRecommendation[0] || null
        };
    }
    
    
    
    async generateFollowingRecommendations(
        userId: string,
        currentBookId: string
    ): Promise<IRecommendations> {
        // Step 1: Get all books the user has already liked, disliked, or viewed
        const userLikes = await Likes.aggregate([
            { $match: { user_id: new Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'books',
                    localField: 'book_id',
                    foreignField: '_id',
                    as: 'book'
                }
            }
        ]).exec();
    
        const userDislikes = await Dislikes.aggregate([
            { $match: { user_id: new Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'books',
                    localField: 'book_id',
                    foreignField: '_id',
                    as: 'book'
                }
            }
        ]).exec();
    
        const userViews = await Views.aggregate([
            { $match: { user_id: new Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'books',
                    localField: 'book_id',
                    foreignField: '_id',
                    as: 'book'
                }
            }
        ]).exec();
    
        // Collect the book IDs from user's interactions
        const likedBookIds = userLikes.map((like) => like.book_id);
        const dislikedBookIds = userDislikes.map((dislike) => dislike.book_id);
        const viewedBookIds = userViews.map((view) => view.book_id);
    
        // Combine books to exclude: already liked, disliked, viewed, and the current book
        const excludedBooks = [...new Set([...likedBookIds, ...dislikedBookIds, ...viewedBookIds, currentBookId])]
            .map((id) => new Types.ObjectId(id));
    
        // Step 2: Generate a recommendation if the user likes the current book
        const likedRecommendationAggregate = await Likes.aggregate([
            { $match: { book_id: new Types.ObjectId(currentBookId) } }, // Find users who liked the current book
            {
                $lookup: {
                    from: 'likes',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'otherLikes',
                },
            },
            { $unwind: '$otherLikes' }, // Flatten the array
            { $match: { 
                'otherLikes.book_id': { $nin: excludedBooks },
                'author_id': { $ne: new Types.ObjectId(userId) } // Exclude books authored by the user
            } }, // Exclude books user already interacted with
            { $group: { _id: '$otherLikes.book_id' } }, // Group by book_id
            { $sample: { size: 1 } }, // Randomly select one book
        ]).exec();
    
        const dislikedRecommendationAggregate = await Dislikes.aggregate([
            { $match: { book_id: new Types.ObjectId(currentBookId) } }, // Find users who disliked the current book
            {
                $lookup: {
                    from: 'dislikes',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'otherDislikes',
                },
            },
            { $unwind: '$otherDislikes' }, // Flatten the array
            { $match: { 
                'otherDislikes.book_id': { $nin: excludedBooks },
                'author_id': { $ne: new Types.ObjectId(userId) }// Exclude books authored by the user
            } }, // Exclude books user already interacted with
            { $group: { _id: '$otherDislikes.book_id' } }, // Group by book_id
            { $sample: { size: 1 } }, // Randomly select one book
        ]).exec();
    
        // Fetch the actual book details for the liked and disliked recommendation
        let likedBook: IBooks | null = likedRecommendationAggregate.length > 0
            ? await Books.findById(likedRecommendationAggregate[0]._id)
                .populate({ path: 'author_id', select: '-password' }) // Populate author information except password
                .exec()
            : null;
    
        let dislikedBook: IBooks | null = dislikedRecommendationAggregate.length > 0
            ? await Books.findById(dislikedRecommendationAggregate[0]._id)
                .populate({ path: 'author_id', select: '-password' }) // Populate author information except password
                .exec()
            : null;
    
        // Step 4: Fetch random book if liked or disliked recommendation is null
        if (!likedBook) {
            const randomLikedBook = await Books.aggregate([
                { $match: { 
                    _id: { $nin: excludedBooks },
                    author_id: { $ne: new Types.ObjectId(userId) } // Exclude books authored by the user
                } },
                { $sample: { size: 1 } }, // Randomly select a book
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author_id',
                        foreignField: '_id',
                        as: 'author',
                    },
                },
                { $project: { 'author.password': 0 } }, // Exclude password field from author details
            ]).exec();
    
            likedBook = randomLikedBook.length > 0 ? randomLikedBook[0] : null;
        }
    
        if (!dislikedBook) {
            const randomDislikedBook = await Books.aggregate([
                { $match: { 
                    _id: { $nin: excludedBooks },
                    author_id: { $ne: new Types.ObjectId(userId) } // Exclude books authored by the user
                } },
                { $sample: { size: 1 } }, // Randomly select a book
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author_id',
                        foreignField: '_id',
                        as: 'author',
                    },
                },
                { $project: { 'author.password': 0 } }, // Exclude password field from author details
            ]).exec();
    
            dislikedBook = randomDislikedBook.length > 0 ? randomDislikedBook[0] : null;
        }
    
        // Return the recommendations
        return {
            likedRecommendation: likedBook,
            dislikedRecommendation: dislikedBook,
        };
    }
    
    
    
}

export default BooksService;