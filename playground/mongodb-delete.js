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

  // deleteMany - delete all that matches criteria
  // db.collection('Users').deleteMany({name: 'Simon'}).then((result)=> {
  //   console.log(result);
  // });

  // deleteOne - delete first that matches criteria
  // db.collection('Todos').deleteOne({text:'First document'}).then((result) => {
  //   console.log(result);
  // })

  // findOneAndDelete -- find one, return it and delete it
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5a1db66b18caba13cd37ba1d')
  }).then((result) => {
    console.log(result);
  })

  db.close();
});
