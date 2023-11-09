import Router from 'express'
import * as productController from './controllers/productController.js'
import roleMiddleware from './middleware/roleMiddleware.js'

const router = new Router()

router.post('/add', roleMiddleware(['ADMIN']), productController.addProduct)
router.post('/get', productController.getProduct)


export default router
