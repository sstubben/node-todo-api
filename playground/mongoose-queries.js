const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo.js')
const {User} = require('./../server/models/user.js')

// var id = '5a3fbc6abd5952bc29b5cc4122'
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid')
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos: ', todos);
// })
//
// Todo.findOne({ // only prints the first of the query
//   _id: id
// }).then((todo) => {
//   console.log('Todo: ', todo);
// })

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo by ID', todo)
// }).catch((e) => { // in case the objectID is invalid
//   console.log(e);
// })

var userID = '5a397fd70c4cf361268c19a9'


User.findById(userID).then((user) => {
  if (!user) {
    return console.log('User not found')
  }
  console.log('User by ID', user)
}).catch((e) => {
  console.log(e)
})
