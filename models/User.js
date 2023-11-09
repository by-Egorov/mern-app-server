import mongoose from 'mongoose'
import CartSchema from './Cart.js'
import FavoriteSchema from './Favorite.js'

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: String,
        ref: 'Role',
      },
    ],
    cart: {
        type: Array,
        ref: 'Cart'
    },
    favorites: {
        type: Array,
        ref: 'Favorite'
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('User', UserSchema)
