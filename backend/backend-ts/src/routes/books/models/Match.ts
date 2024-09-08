import mongoose, { Document, Schema } from 'mongoose';

export interface IMatches extends Document {
    first_user_id: string,
    second_user_id: string,
    first_book_id: string,
    second_book_id: string,
    accepted_by_first: boolean,
    accepted_by_second: boolean,
    createdAt?: Date; 
    updatedAt?: Date;
}

const MatchSchema: Schema = new Schema({
    first_user_id: { type: String, ref: 'Users', required: true },
    second_user_id: { type: String, ref: 'Users', required: true },
    first_book_id: { type: String, ref: 'Books', required: true },
    second_book_id: { type: String, ref: 'Books', required: true },
    accepted_by_first: { type: Boolean, required: true },
    accepted_by_second: { type: Boolean, required: true }
}, {
    timestamps: true
});

MatchSchema.pre('validate', function(next) {
    if (this.first_user_id === this.second_user_id) {
        this.invalidate('second_user_id', 'Second user ID must be different from the first user ID');
    }
    next();
});

export default mongoose.model<IMatches>('Matches', MatchSchema);
