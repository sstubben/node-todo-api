const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false

  },
  completedAt: {
    type: Number,
    default: null
  },
  // using underscore to show that it's an ID
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
})

module.exports = {Todo};
