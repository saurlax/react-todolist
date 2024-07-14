import { Schema, Types, model } from 'mongoose'

interface ITodo {
  name: string,
  deadline: number,
  completed: boolean,
  owner: Types.ObjectId,
}

const Todo = model<ITodo>('Todo', new Schema<ITodo>({
  name: { type: String, required: true },
  deadline: { type: Number, required: true },
  completed: { type: Boolean, required: true },
}))

export default Todo