import mongoose from 'mongoose'

const itemInstanceSchema = new mongoose.Schema({
  token_id: {
    type: String,
    required: true
  },
  def_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ItemDefinition',
    required: true
  }
})

export default mongoose.model('ItemInstance', itemInstanceSchema)
