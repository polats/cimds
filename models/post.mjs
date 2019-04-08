import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String
  },
  content: {
    type: String
  }
})

export default mongoose.model('Post', postSchema)
