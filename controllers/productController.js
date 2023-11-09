import ProductSchema from '../models/Product.js'
import UserSchema from '../models/User.js'
import CartSchema from '../models/Cart.js'
import Product from '../models/Product.js'
import Cart from '../models/Cart.js'

export const addProduct = async (req, res) => {
  try {
    const { title, description, price, image } = req.body
    const doc = await new ProductSchema({
      title,
      description,
      price,
      image,
    })

    const product = await doc.save()
    const { ...productData } = product._doc
    res.json({ ...productData })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      message: 'Added product error',
    })
  }
}

export const getProduct = async (req, res) => {
  try {
    const products = await ProductSchema.find()

    return res.json({ products })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      message: 'Get product error',
    })
  }
}

export const addProductCart = async (req, res) => {
  const userId = req.params.userId // Получаем идентификатор пользователя из URL
  const productId = req.body.productId // Получаем идентификатор продукта из тела запроса
  const quantityToAdd = 1
  // Проверяем, существует ли пользователь
  try {
    // Проверяем, существует ли продукт
    const product = await Product.findById(productId)
    console.log(product)

    if (product) {
      // Найден продукт, добавьте его в корзину
      const userCart = await Cart.findOne({ user: userId })
      if (userCart) {
        userCart.items.push({
          product: product,
          title: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
          quantity: quantityToAdd,
        })
        await userCart.save()
      } else {
        const newCart = new Cart({
          user: userId,
          items: [
            {
              product: product,
              title: product.title,
              description: product.description,
              price: product.price,
              image: product.image,
              quantity: quantityToAdd,
            },
          ],
        })
        await newCart.save()
      }

      console.log('Продукт успешно добавлен в корзину пользователя')
      res.status(200).json({ message: 'Продукт успешно добавлен в корзину' })
    } else {
      console.log('Продукт не найден')
      res.status(404).json({ message: 'Продукт не найден' })
    }
  } catch (error) {
    console.error('Ошибка при добавлении продукта в корзину:', error)
    res
      .status(500)
      .json({ message: 'Произошла ошибка при добавлении продукта в корзину' })
  }
}
