import mongoose from 'mongoose'

const itemInstanceSchema = new mongoose.Schema({
  def_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ItemDefinition',
    required: true
  }
})

export default mongoose.model('ItemInstance', itemInstanceSchema)
