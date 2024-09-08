import mongoose, { Document, Schema } from 'mongoose';

export interface ILikes extends Document {
    user_id: string,
    book_id: string,
    createdAt?: Date; 
}

const LikeSchema: Schema = new Schema({
    user_id: { type: String, required: true }, 
    book_id: { type: String,ref: "Books", required: true }
}, {
    timestamps: true 
});

export default mongoose.model<ILikes>('Likes', LikeSchema);
