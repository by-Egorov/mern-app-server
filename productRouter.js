import Router from 'express'
import roleMiddleware from './middleware/roleMiddleware.js'
import {addProduct, getProduct} from "./controllers/productController.js";

const router = new Router()

router.post('/add', roleMiddleware(['ADMIN']), addProduct)
router.post('/get', getProduct)


export default router
