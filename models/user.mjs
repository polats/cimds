import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  local: {
    type: mongoose.Schema.Types.Mixed
  }
})

export default mongoose.model('User', userSchema)
