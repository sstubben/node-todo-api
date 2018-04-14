const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true
      }
  }]
})

// Schema is necessary if you want to add instance methods / userObject.function :

UserSchema.methods.toJSON = function () {
  var user = this
  // toObject is responsible for taking the mongooese variable (in this case user)
  // and convert it into a regular object, where only the properties available
  // in the document exists
  var userObject = user.toObject()

  return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
  var user = this
  var access = 'auth'
  var token = jwt.sign({_id: user._id.toHexString(), access},'123qwe').toString()

  user.tokens = user.tokens.concat([{access, token}])

  return user.save().then( () => {
    return token
  })
}

// Adding model method / User.function

UserSchema.statics.findByToken = function (token) {
  var User = this; // note it's the model not the object
  var decoded;

  try {
    decoded = jwt.verify(token, '123qwe')
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject()
    // })
    return Promise.reject()
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

var User = mongoose.model('User', UserSchema)

module.exports = {User}
