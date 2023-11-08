import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import RoleSchema from '../models/Role.js'
import UserSchema from '../models/User.js'

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  }
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' })
}
//Register

export const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Ошибка при регистрации', errors })
    }
    const password = req.body.password

    const salt = await bcrypt.genSalt(7)
    const hash = await bcrypt.hash(password, salt)

    const userRole = await RoleSchema.findOne({ value: 'USER' })
    const doc = new UserSchema({
      email: req.body.email,
      passwordHash: hash,
      roles: [userRole.value],
    })
    const user = await doc.save()
    const { passwordHash, ...userData } = user._doc
    res.json({
      ...userData,
    })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      message: 'Registration error',
    })
  }
}
//Login
export const login = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email })
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Пользователь с таким email не найден' })
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    )
    if (!isValidPass) {
      return res.status(400).json({ message: 'Введен неверный пароль' })
    }
    const token = generateAccessToken(user._id, user.roles)
    const { passwordHash, ...userData } = user._doc
    res.json({
      token,
    })
    // return res.json({ token })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      message: 'Login error',
    })
  }
}
// //Get user
export const getUsers = async (req, res) => {
  try {
    const users = await UserSchema.find()

    return res.json({users})
  } catch (e) {
    console.log(e)
    res.status(400).json({
      message: 'Get Users error',
    })
  }
}
// Update
export const updateUser = async (req, res) => {
  const { userId } = req.params
  const updatedUserData = req.body
  try {
    //Поиск пользователя по I'd
    const user = await UserSchema.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    })
    res.json(user)
  } catch (err) {
    console.error('Ошибка при обновлении данных пользователя:', error)
    res.status(500).json({ error: 'Ошибка при обновлении данных пользователя' })
  }
}
