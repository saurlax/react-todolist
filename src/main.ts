import express, { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from './models/User'
import Todo from './models/Todo'

dotenv.config()

const app = express()
app.use(express.json())

const secret = crypto.randomBytes(64).toString('hex')

mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/todolist')

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] ?? ''
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).json(err)
    } else {
      req.jwt = decoded
      next()
    }
  })
}

app.post('/api/login', (req: Request, res: Response) => {
  const { username, password } = req.body
  User.findOne({ username, password }).then(user => {
    if (user) {
      const token = jwt.sign({ username: user.username }, secret, { expiresIn: '1h' })
      res.json({ token })
    } else {
      res.sendStatus(401)
    }
  }).catch(_ => {
    res.sendStatus(500)
  })
})

app.post('/api/register', (req: Request, res: Response) => {
  const { username, password } = req.body
  User.create({ username, password }).then(_ => {
    res.sendStatus(201)
  }).catch(_ => {
    res.sendStatus(500)
  })
})

app.get('/api/todos', authMiddleware, (req: Request, res: Response) => {
  const owner = req.jwt?.username
  Todo.find({ owner }).then(todos => {
    res.json(todos)
  }).catch(_ => {
    res.sendStatus(500)
  })
})

app.post('/api/todo', authMiddleware, (req: Request, res: Response) => {
  const { id, name, deadline, completed } = req.body
  if (id) {
    Todo.findByIdAndUpdate(id, { name, deadline, completed }).then(_ => {
      res.sendStatus(200)
    }).catch(err => {
      res.status(500).json(err)
    })
  } else {
    Todo.create({ name, deadline, completed }).then(_ => {
      res.sendStatus(201)
    }).catch(err => {
      res.status(500).json(err)
    })
  }
})

app.use(express.static('dist'))

app.use((req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile('frontend/dist/index.html')
  } else {
    res.sendStatus(404)
  }
})

console.log(`Server running at http://localhost:3000/`)
app.listen(3000)