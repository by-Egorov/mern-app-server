import Router from 'express'
import { check } from 'express-validator'
import authMiddleware from './middleware/authMiddleware.js'
import {addCart, addFavorite, getProductFavorite} from './controllers/productController.js'
import {getUsers, login, register} from "./controllers/authController.js";

const router = new Router()
router.post(
  '/register',
  [
    check('email', 'Поле email не может быть пустым').notEmpty(),
    check(
      'password',
      'Пароль должен быть больше 4 и меньше 10 символов'
    ).isLength({ min: 4, max: 10 }),
  ],
  register
)
router.post('/login', login)
router.get('/users', getUsers)
router.get('/user/:userId/favorite',authMiddleware, getProductFavorite)
router.post('/user/:userId/favorite/add', addFavorite)
router.post('/user/:userId/cart/add', addCart)

export default router
