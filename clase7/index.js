import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'
const app = express()

const port = PORT

app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  const token = req.cookies.auth_token

  req.session = { user: null }
  try {
    const data = jwt.verify(token, SECRET_JWT_KEY)
    req.session.user = data
  } catch {}

  next()
})

app.get('/', (req, res) => {
  const { user } = req.session
  return res.render('index', user)
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await UserRepository.login({ username, password })
    const token = await jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_JWT_KEY, {
      expiresIn: '1h'
    })
    res
      .cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60
      })
      .send({ user })
  } catch (e) {
    res.status(400).send('invalid credentials: ' + e.message)
  }
})
app.post('/register', async (req, res) => {
  const { username, password } = req.body
  try {
    const id = await UserRepository.create({ username, password })
    res.json({ id })
  } catch (e) {
    res.status(400).send('User failed to be created: ' + e.message)
  }
})
app.post('/logout', (req, res) => {
  return res
    .clearCookie('auth_token')
    .json({ message: 'Logout succesful' })
})

app.get('/protected', (req, res) => {
  const { user } = req.session
  if (!user) {
    return res.status(403).send('access not authorized')
  }
  return res.render('protected', user)
})

app.listen(port, () => {
  console.log('server running on: ', `http://localhost:${port}`)
})
