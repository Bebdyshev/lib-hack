import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  full_name: string;
  phone_number: string;
  rank: string;
  pfp_url: string;
  email: string;
  password: string;
  gender: boolean;
  role: string;
}

const UserSchema: Schema = new Schema({
  full_name: {type: String},
  phone_number: {type: String, unique: true},
  rank: {type: String},
  pfp_url: {type: String},
  email: { type: String, required: true, unique: true },
  username: { type: String },
  password: { type: String, required: true },
  gender: {type: Boolean},
  role: {type: String, default: "user"}
});

export default mongoose.model<IUser>('Users', UserSchema);