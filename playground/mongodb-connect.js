//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// object destructuring ES6:
// var user = {name: 'simon', age: 31};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false
  }, (err, result)=>{
    if (err) {
      return console.log('Unable to insert todo', err);
    }
    // result.ops store all the docs that we're inserting - only one in this case
    console.log(JSON.stringify(result.ops, undefined, 2));
  })

  // db.collection('Users').insertOne({
  //   name: 'Simon',
  //   age: 31,
  //   location: 'Barcelona'
  // }, (err, result)=> {
  //   if (err) {
  //     return console.log('Unable to insert User');
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
  // })

  db.close();
});
