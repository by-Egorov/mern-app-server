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

// http://localhost:5000/api/users/me
app.get('/api/users/me', authMiddleware, async (req, res) => {
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

// http://localhost:5000/api/products
app.post('/api/products', roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { title, category, description, price, totalPrice, image } = req.body
    const doc = new Product({
      title,
      category,
      description,
      price,
      totalPrice,
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

// http://localhost:5000/api/favorites
app.get('/api/favorites', authMiddleware, async (req, res) => {
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

// http://localhost:5000/api/cart
app.get('/api/cart', authMiddleware, async (req, res) => {
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

// http://localhost:5000/api/favorites/add
app.post('/api/favorites/add', authMiddleware, async (req, res) => {
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

// http://localhost:5000/api/cart/add
app.post('/api/cart/add', authMiddleware, async (req, res) => {
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

app.delete('/api/favorite/remove', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const productId = req.body.productId

   
    const user = await User.findById(userId)

    const productIndex = user.favorite.findIndex(
      (item) => item.toString() === productId
    )

    if (productIndex !== -1) {
      user.favorite.splice(productIndex, 1)

      await user.save()

      const updatedFavorite = await Promise.all(
        user.favorite.map(async (productId) => {
          return await Product.findById(productId)
        })
      )

      return res.json({ favorite: updatedFavorite })
    } else {
      return res.status(404).json({ message: 'Продукт не найден в избранном' })
    }
  } catch (error) {
    console.error('Ошибка при удалении продукта из избранного:', error)
    res
      .status(500)
      .json({ message: 'Произошла ошибка при удалении продукта из избранного' })
  }
})

// http://localhost:5000/api/cart/remove
app.delete('/api/cart/remove', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const productId = req.body.productId

    // Найдем пользователя по идентификатору
    const user = await User.findById(userId)

    // Найдем индекс продукта в корзине
    const productIndex = user.cart.findIndex(
      (item) => item.toString() === productId
    )

    if (productIndex !== -1) {
      user.cart.splice(productIndex, 1)

      await user.save()

      const updatedCart = await Promise.all(
        user.cart.map(async (productId) => {
          return await Product.findById(productId)
        })
      )

      return res.json({ cart: updatedCart })
    } else {
      return res.status(404).json({ message: 'Продукт не найден в корзине' })
    }
  } catch (error) {
    console.error('Ошибка при удалении продукта из корзины:', error)
    res
      .status(500)
      .json({ message: 'Произошла ошибка при удалении продукта из корзины' })
  }
})

// http://localhost:5000/api/products/:id
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id

    if (productId.toLowerCase() === 'favorite') {
      const favoriteProducts = await getFavoriteProducts()
      return res.json({ products: favoriteProducts })
    }
    console.log(productId)
    const product = await Product.findById(productId)
    console.log(product)
    res.json({ product })
  } catch (error) {
    console.error('Ошибка при получении продукта:', error)
    res.status(500).json({ message: 'Произошла ошибка при получении продукта' })
  }
})

app.patch('/api/product', authMiddleware, async (req, res) => {
  try {
    const { productId, updates } = req.body
    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true
    })
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(updatedProduct)
  } catch (err) {
    console.error('Ошибка при обновлении данных пользователя:', error)
    res.status(500).json({ error: 'Ошибка при обновлении данных пользователя' })
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
