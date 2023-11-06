import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'

const PORT = process.env.PORT || 3001
// Поключение к ДБ
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('DB ok'))
    .catch(() => console.log('DB error', err))
// Создание сервера
const server = express()

server.use(express.json())

// запуск сервера
server.listen(PORT, er => {
    if (er) {
        return console.log(er)
    }
    console.log(`server ok, ${PORT}`)
})