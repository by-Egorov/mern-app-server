import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import authRouter from './authRouter.js'
import corsMiddleware from './middleware/cors.middleware.js'
import productRouter from "./productRouter.js";

const PORT = process.env.PORT || 3001
// Подключение к ДБ
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB ok'))
  .catch(() => console.log('DB error', err))
// Создание сервера
const server = express()

server.use(express.json())
server.use(corsMiddleware)
server.use('/api', authRouter)
server.use('/product', productRouter)

server.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['Authorization'],
}))

// запуск сервера
server.listen(PORT, (er) => {
  if (er) {
    return console.log(er)
  }
  console.log(`server ok, ${PORT}`)
})
