import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 1
  },
  favorite: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model('Product', ProductSchema)
