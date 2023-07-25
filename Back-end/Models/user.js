const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
   
  },
  lng: {
    type: Number,

  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
