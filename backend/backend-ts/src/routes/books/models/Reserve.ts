import mongoose, { Document, Schema } from 'mongoose';

export interface IReservs extends Document {
    book_id: string,
    user_id: string,      
    status: string,      
    queue_position: number, 
    reserved_at: Date;    
}

const ReservSchema: Schema = new Schema({
    book_id: { type: Schema.Types.ObjectId, ref: 'Books', required: true }, 
    user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true }, 
    status: { type: String, default: 'pending' }, 
    queue_position: { type: Number, required: true },
    reserved_at: { type: Date, default: Date.now }
}, {
    timestamps: true 
});

export default mongoose.model<IReservs>('Reservations', ReservSchema);
