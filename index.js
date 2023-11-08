import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import * as authController from './controllers/authController.js'
import CheckAuth from './utils/CheckAuth.js'
import authRouter from './authRouter.js'
import { registerValidation } from './validations/auth.js'
import corsMiddleware from './middleware/cors.middleware.js'

const PORT = process.env.PORT || 3001
// Поключение к ДБ
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB ok'))
  .catch(() => console.log('DB error', err))
// Создание сервера
const server = express()

server.use(express.json())
server.use(corsMiddleware)
server.use('/auth', authRouter)

server.use(cors())

// запуск сервера
server.listen(PORT, (er) => {
  if (er) {
    return console.log(er)
  }
  console.log(`server ok, ${PORT}`)
})
