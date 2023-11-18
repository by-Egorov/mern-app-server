import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import corsMiddleware from './middleware/cors.middleware.js'
import authRouter from './authRouter.js'
import User from './models/User.js'
import Product from './models/Product.js'
import authMiddleware from './middleware/authMiddleware.js'
import roleMiddleware from './middleware/roleMiddleware.js'

const PORT = process.env.PORT || 3001
// Подключение к ДБ
mongoose
  .connect(process.env.MONGODB_URI)

  .then(() => console.log('DB ok'))
  .catch(() => console.log('DB error', err))
// Создание сервера
const app = express()

app.use(express.json())
app.use(corsMiddleware)
app.use('/api', authRouter)

// http://localhost:5000/api/user/me
app.get('/api/user/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    return res.json({ user })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      message: 'Get Users error',
    })
  }
})
// http://localhost:5000/api/products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find()

    return res.json({ products })
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error)
    res
      .status(500)
      .json({ message: 'Произошла ошибка при получении продуктов' })
  }
})

// http://localhost:5000/api/products/:id
// app.get('/api/products/:id', async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id)
//     res.json({ product })
//   } catch (error) {
//     console.error('Ошибка при получении продукта:', error)
//     res.status(500).json({ message: 'Произошла ошибка при получении продукта' })
//   }
// })

// http://localhost:5000/api/products/:id
// app.delete('/api/products/cart/delete', authMiddleware, async (req, res) => {
//   try {
//     const productId = req.body.productId
//     const userId = req.user.id
//     const user = await User.findById(userId)
//     console.log(user)

//     if (!user) {
//       console.log('Пользователь не найден')
//       return res.status(404).json({ message: 'Пользователь не найден' })
//     }

//     const product = await Product.findById(productId)
//     console.log(product)
//     if (!product) {
//       return res.json({ message: 'Такого продукта не существует' })
//     }
//     await User.findByIdAndUpdate(
//       user._id,
//       {
//         $pull: { cart: product._id },
//       },
//       { new: true }
//     )
//   } catch (error) {
//     console.error('Ошибка удаления продукта:', error)
//     res.status(500).json({ message: 'Произошла ошибка удаления продукта' })
//   }
// })

// http://localhost:5000/api/products/add
app.post('/api/products/add', roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { title, category, description, price, image } = req.body
    const doc = new Product({
      title,
      category,
      description,
      price,
      image,
    })

    const product = await doc.save()
    const { ...productData } = product._doc
    console.log('Продукт успешно добавлен')
    res.status(200).json({ message: 'Продукт успешно добавлен' })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      message: 'Added product error',
    })
  }
})

// http://localhost:5000/api/products/favorite
app.get('/api/products/favorite', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const list = await Promise.all(
      user.favorite.map((product) => {
        return Product.findById(product._id)
      })
    )

    return res.json({ list })
  } catch (error) {
    console.error('Ошибка при получении избранных товаров:', error)
    res
      .status(500)
      .json({ message: 'Произошла ошибка при получении избранных товаров' })
  }
})

// http://localhost:5000/api/products/cart
app.get('/api/products/cart', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const list = await Promise.all(
      user.cart.map((product) => {
        return Product.findById(product._id)
      })
    )
    return res.json({ list })
  } catch (error) {
    console.error('Ошибка при получении товаров корзины:', error)
    res
      .status(500)
      .json({ message: 'Произошла ошибка при получении товаров корзины' })
  }
})

// http://localhost:5000/api/products/favorite/add
app.post('/api/products/favorite/add', authMiddleware, async (req, res) => {
  try {
    const productId = req.body.productId
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
      console.log('Пользователь не найден')
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    const product = await Product.findById(productId)

    if (!product) {
      console.log('Продукт не найден')
      return res.status(404).json({ message: 'Продукт не найден' })
    }

    await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: { favorite: product._id },
      },
      { new: true }
    )
    console.log('Продукт успешно добавлен в избранное')
    res.status(200).json({ message: 'Продукт успешно добавлен в избранное' })
  } catch (error) {
    console.error('Ошибка при добавлении продукта в избранное:', error)
    res
      .status(500)
      .json({ message: 'Произошла ошибка при добавлении продукта в избранное' })
  }
})

// http://localhost:5000/api/products/cart/add
app.post('/api/products/cart/add', authMiddleware, async (req, res) => {
  try {
    const productId = req.body.productId
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
      console.log('Пользователь не найден')
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    const product = await Product.findById(productId)

    if (!product) {
      console.log('Продукт не найден')
      return res.status(404).json({ message: 'Продукт не найден' })
    }

    await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: { cart: product._id },
      },
      { new: true }
    )
    console.log('Продукт успешно добавлен в корзину')
    res.status(200).json({ message: 'Продукт успешно добавлен в корзину' })
  } catch (error) {
    console.error('Ошибка при добавлении продукта в корзину:', error)
    res
      .status(500)
      .json({ message: 'Произошла ошибка при добавлении продукта в корзину' })
  }
})

// http://localhost:5000/api/products/cart/delete
app.delete('/api/products/cart/delete', authMiddleware, async (req, res) => {
  try {
    const productId = req.body.productId
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
      console.log('Пользователь не найден')
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    const product = await Product.findById(productId)

    if (!product) {
      console.log('Продукт не найден')
      return res.status(404).json({ message: 'Продукт не найден' })
    }

    await User.findByIdAndUpdate(
      user._id,
      {
        $pull: { cart: product._id },
      },
      { new: true }
    )
    console.log('Продукт успешно добавлен в корзину')
    res.status(200).json({ message: 'Продукт успешно добавлен в корзину' })
  } catch (error) {
    console.error('Ошибка при добавлении продукта в корзину:', error)
    res
      .status(500)
      .json({ message: 'Произошла ошибка при добавлении продукта в корзину' })
  }
})

app.use(cors())

// запуск сервера
app.listen(PORT, (er) => {
  if (er) {
    return console.log(er)
  }
  console.log(`server ok, ${PORT}`)
})
