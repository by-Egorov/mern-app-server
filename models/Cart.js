import mongoose from 'mongoose'

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
      title: String,
      description: String,
      price: Number,
      image: String,
    },
  ],
  totalQuantity: Number,
})

export default mongoose.model('Cart', CartSchema)