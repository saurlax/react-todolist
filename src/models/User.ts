import { Schema, model } from 'mongoose'

interface IUser {
  username: string,
  password: string,
}

const User = model<IUser>('User', new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
}))

export default User