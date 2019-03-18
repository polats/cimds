import mongoose from 'mongoose'

const fileUploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  }
})

export default mongoose.model('FileUpload', fileUploadSchema)
