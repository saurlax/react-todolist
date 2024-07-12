import { Schema, model } from 'mongoose'

interface ITodo {
  name: string,
  deadline: number,
  completed: boolean
}

const Todo = model<ITodo>('Todo', new Schema<ITodo>({
  name: { type: String, required: true },
  deadline: { type: Number, required: true },
  completed: { type: Boolean, required: true },
}))

export default Todo