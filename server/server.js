require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')

const{mongoose} = require('./db/mongoose')
const {ObjectID} = require('mongodb')

var {Todo} = require('./models/todo')
var {User} = require('./models/user')

var app = express()
const port = process.env.PORT

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
  var todo = new Todo({
    text: req.body.text
  })
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
  //console.log(req.body);
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.get('/todos/:id', (req, res) => {
  // req.params will include the key/value pair
  // where the key is the url parameter, like id, and
  // the value is the value of the key
  var id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    res.send(todo)
  }).catch((e) => {
    res.status(400).send()
  })
})

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send()
    }
    res.send({todo})

  }).catch((e) => {
    res.status(400).send()
  })
})

app.patch('/todos/:id', (req, res)=> {
  var id = req.params.id
  var body = _.pick(req.body, ['text', 'completed'])
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send()
    }
    res.send({todo})

  }).catch((e) => {
    res.status(400).send(e)
  })
})

// POST /users
app.post('/users', (req,res) => {
  var body = _.pick(req.body, ['email', 'password'])
  var user = new User(body)

  // model method:
  // User.findByToken
  // instance method:
  //user.generateAuthToken()

  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e)
  })
  //console.log(req.body);
})

app.listen(port, () => {
  console.log(`Started on port ${port}`);
})

module.exports = {app}
