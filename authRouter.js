import Router from 'express'
import { check } from 'express-validator'
import * as authController from './controllers/authController.js'
import authMiddleware from './middleware/authMiddleware.js'
import {addProductCart} from "./controllers/productController.js";

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
  authController.register
)
router.post('/login', authController.login)
router.get('/users',authMiddleware, authController.getUsers)
router.post('/user/:userId/cart/add', addProductCart)

export default router
