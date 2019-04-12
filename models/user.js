const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  local: {
    type: mongoose.Schema.Types.Mixed
  }
})

module.exports = mongoose.model('User', userSchema)
