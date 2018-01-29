const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo.js')
const {User} = require('./../server/models/user.js')

// Todo.remove({}).then((result) => {
//   console.log(result);
// }) // only returns the number/quantity that was removed


// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findOneAndRemove({_id: "5a6f7a3bff04f22ef4623132"}).then((todo) => {
  console.log(todo);
})

Todo.findByIdAndRemove('5a6f7a42e292512f09ca797a').then((todo) => {
  console.log(todo)
})
