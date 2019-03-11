import mongoose from 'mongoose'

const itemDefinitionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

export default mongoose.model('ItemDefinition', itemDefinitionSchema)
