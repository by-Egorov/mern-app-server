import mongoose from 'mongoose'

const FavoriteSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
})

export default mongoose.model('Favorite', FavoriteSchema)
