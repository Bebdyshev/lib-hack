import mongoose, { Document, Schema } from 'mongoose';

export interface IDislikes extends Document {
    user_id: string,
    book_id: string
}

const DislikeSchema: Schema = new Schema({
    user_id: { type: String, required: true }, 
    book_id: { type: String, required: true }, 
});

export default mongoose.model<IDislikes>('Dislikes', DislikeSchema);
