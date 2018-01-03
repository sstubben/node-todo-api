var express = require('express');
var bodyParser = require('body-parser');

var{mongoose} = require('./db/mongoose')
const {ObjectID} = require('mongodb')

var {Todo} = require('./models/todo')
var {User} = require('./models/user')

var app = express();

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
  }, (e) => {
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
  }, (e) => {
    res.status(400).send()
  })
})

app.listen(3000, () => {
  console.log('Started on port 3000');
})

module.exports = {app}
