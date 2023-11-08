import mongoose from 'mongoose'

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
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('User', UserSchema)
