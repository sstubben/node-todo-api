//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// object destructuring ES6:
// var user = {name: 'simon', age: 31};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoAppTest', (err,db) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
  //   console.log('Todos:');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) =>{
  //   console.log('Unable to fetch todos', err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  //
  // }, (err) =>{
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('todos').find({}).then((docs) => {
    console.log('Todos:');
    console.log(JSON.stringify(docs, undefined, 2));

  }, (err) =>{
    console.log('Unable to fetch Users', err);
  });

  db.close();
});
