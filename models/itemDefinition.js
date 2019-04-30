const mongoose = require('mongoose');

const itemDefinitionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
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
  },
  otherProps: {
    type: Object
  }
})

module.exports = mongoose.model('ItemDefinition', itemDefinitionSchema)
