const mongoose = require('mongoose');

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

module.exports = mongoose.model('ItemInstance', itemInstanceSchema)
