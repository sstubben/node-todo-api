const mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    // validate: {
    //   validator: function (email) {
    //     var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    //     return emailRegex.test(email.text); // Assuming email has a text attribute
    //   },
    //   message: '{VALUE} is not a valid email'
    // }
  }
})

module.exports = {User}
