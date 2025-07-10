import { randomUUID } from 'node:crypto'

import DBLocal from 'db-local'
import bcrypt from 'bcrypt'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})
export class UserRepository {
  static async create ({ username, password }) {
    // 1. validate user
    Validate.username(username)
    Validate.password(password)
    // 2. verificar que username es unico
    const user = User.findOne({ username })
    if (user) throw new Error('user already exists')

    const id = randomUUID()
    const hashedPssword = await bcrypt.hash(password, 10)

    User.create({
      _id: id,
      username,
      password: hashedPssword
    }).save()

    return id
  }

  static async login ({ username, password }) {
    Validate.username(username)
    Validate.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error("username doesn't exist")

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('password is invalid')

    // removes password and returns the object without it
    // const { password: _, ...publicUser } = user
    // return publicUser

    const publicUser = {
      _id: user._id,
      username: user.username
    }
    return publicUser
  }
}

class Validate {
  static password (password) {
    if (typeof password !== 'string') throw new Error('password must be a string')
    if (password.length < 8) throw new Error('password must be at least 8 characters long')
  }

  static username (username) {
    if (typeof username !== 'string') throw new Error('username must be a string')
    if (username.length < 3) throw new Error('username must be at least 3 characters long')
  }
}
