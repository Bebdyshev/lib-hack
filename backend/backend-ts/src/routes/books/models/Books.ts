import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBooks extends Document {
    media_urls: string[];
    title: string;
    description: string;
    author_id: string;
    number_likes: number;
    number_com: number;
    is_from_library: boolean;
    createdAt?: Date; 
    author: String;
}

interface IBooksModel extends Model<IBooks> {
    search(query: string, page?: number, limit?: number): Promise<IBooks[]>;
}


const BooksSchema: Schema = new Schema({
    media_urls: { type: [String], required: true }, 
    title: { type: String, required: true }, 
    description: { type: String, required: true },
    author_id: { type: String, ref: 'Users',required: true },
    is_from_library: {type: Boolean, default: false},
    number_likes: { type: Number, default: 0 }, 
    number_com: { type: Number, default: 0 },
    number_views: {type: Number, default: 0},
    author: {type: String}
}, {
    timestamps: true 
});

BooksSchema.statics.search = function(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.find({
        $or: [
            { title: new RegExp(query, 'i') },
            { author: new RegExp(query, 'i') }
        ]
    })
    .skip(skip)
    .limit(limit)
    .exec();
};

export default mongoose.model<IBooks, IBooksModel>('Books', BooksSchema);