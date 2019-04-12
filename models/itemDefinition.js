const mongoose = require('mongoose');

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

module.exports = mongoose.model('ItemDefinition', itemDefinitionSchema)
