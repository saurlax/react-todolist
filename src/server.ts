import express from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from './models/User'
import _Todo from './models/Todo'

dotenv.config()

const app = express()
app.use(express.json())

const secret = crypto.randomBytes(64).toString('hex')

mongoose.connect(process.env.MONGODB_URI!)

app.post('/api/login', (req, res) => {
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

app.use(express.static('dist'))

app.use((req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile('dist/index.html')
  }
})

console.log(`Server running at http://localhost:3000/`)
app.listen(3000)