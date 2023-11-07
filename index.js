import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import * as UserController from './controllers/UserController.js'
import CheckAuth from './utils/CheckAuth.js'
import { registerValidation } from './validations/auth.js'

const PORT = process.env.PORT || 3001
// Поключение к ДБ
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB ok'))
  .catch(() => console.log('DB error', err))
// Создание сервера
const server = express()

server.use(express.json())

server.post('/auth/register', registerValidation, UserController.register)
server.post('/auth/login', UserController.login)
server.get('/auth/me', CheckAuth, UserController.getMe)
server.put('/updateUser/:userId', UserController.updateUser)
server.use(cors())

// запуск сервера
server.listen(PORT, (er) => {
  if (er) {
    return console.log(er)
  }
  console.log(`server ok, ${PORT}`)
})
