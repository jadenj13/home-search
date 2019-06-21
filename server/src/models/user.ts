import * as mongoose from 'mongoose';

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: { type: String, index: true, unique: true },
  password: String,
});

const User = mongoose.model<UserDoc>('users', userSchema);

export default User;
