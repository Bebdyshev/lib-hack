import mongoose, { Document, Schema } from 'mongoose';

export interface IViewd extends Document {
    user_id: string,
    book_id: string,
    createdAt?: Date; 
}

const ViewSchema: Schema = new Schema({
    user_id: { type: String, required: true }, 
    book_id: { type: String, required: true }, 
},{
    timestamps: true
});

export default mongoose.model<IViewd>('Views', ViewSchema);
