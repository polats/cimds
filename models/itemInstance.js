const mongoose = require('mongoose');

const itemInstanceSchema = new mongoose.Schema({
  token_id: {
    type: mongoose.Schema.Types.Number,
    unique: true,
    required: true
  },
  def_id: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  }
})

module.exports = mongoose.model('ItemInstance', itemInstanceSchema)
