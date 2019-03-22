import mongoose from 'mongoose'

const itemDefinitionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  external_url: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  }
})

export default mongoose.model('ItemDefinition', itemDefinitionSchema)
