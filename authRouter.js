import Router from 'express'

const router = new Router()
import { check } from 'express-validator'
import * as authController from './controllers/authController.js'

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
router.get('/users', authController.getUsers)

export default router
