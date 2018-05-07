var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("TodoAppTest");
  dbo.collection("users").find({}).toArray().then((docs) => {
    console.log('Users:');
    console.log(JSON.stringify(docs, undefined, 2));

  }, (err) =>{
    console.log('Unable to fetch Users', err);
  });

  db.close();
});
