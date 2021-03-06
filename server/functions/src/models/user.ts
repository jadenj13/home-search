import * as mongoose from 'mongoose';

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  role: string;
}

const userSchema = new mongoose.Schema({
  email: { type: String, index: true, unique: true },
  password: String,
  role: String,
});

const User = mongoose.model<UserDoc>('users', userSchema);

export default User;
