import Product from '../models/Product.js'
import Cart from '../models/Cart.js'
import Favorite from '../models/Favorite.js'

export const addProduct = async (req, res) => {
  try {
    const { title, description, price, image } = req.body
    const doc = await new Product({
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
    const products = await Product.find()

    console.log(products)
    return res.json({ products })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      message: 'Get product error',
    })
  }
}
export const getProductFavorite = async (req, res) => {
  const userId = req.params.userId
  try {
    // Находим избранный объект для данного пользователя
    const userFavorite = await Favorite.findOne({ user: userId });

    if (userFavorite) {
      // Если избранный объект найден, извлекаем список productIds
      const productIds = userFavorite.items.map(item => item.product);

      // Затем находим сами товары по этим идентификаторам
      const favoriteProducts = await Product.find({ _id: { $in: productIds } });

      // Возвращаем найденные товары в формате JSON
      return res.json({ favoriteProducts });
    } else {
      // Если избранный объект не найден, возвращаем пустой массив
      return res.json({ favoriteProducts: [] });
    }
  } catch (error) {
    console.error('Ошибка при получении избранных товаров:', error);
    res.status(500).json({ message: 'Произошла ошибка при получении избранных товаров' });
  }
}
export const addCart = async (req, res) => {
  const userId = req.params.userId
  const productId = req.body.productId
  const quantityToAdd = 1
  try {
    const product = await Product.findById(productId)
    console.log(product)

    if (product) {
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

export const addFavorite = async (req, res) => {
  const userId = req.params.userId
  const productId = req.body.productId
  const quantityToAdd = 1
  try {
    const product = await Product.findById(productId)
    console.log(product)

    if (product) {
      const userFavorite = await Favorite.findOne({ user: userId })
      if (userFavorite) {
        userFavorite.items.push({
          product: product,
          title: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
          quantity: quantityToAdd,
        })
        await userFavorite.save()
      } else {
        const newFavorite = new Favorite({
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
        await newFavorite.save()
      }

      console.log('Продукт успешно добавлен в избранное')
      res.status(200).json({ message: 'Продукт успешно добавлен в избранное' })
    } else {
      console.log('Продукт не найден')
      res.status(404).json({ message: 'Продукт не найден' })
    }
  } catch (error) {
    console.error('Ошибка при добавлении продукта в избранное:', error)
    res
      .status(500)
      .json({ message: 'Произошла ошибка при добавлении продукта в избранное' })
  }
}
