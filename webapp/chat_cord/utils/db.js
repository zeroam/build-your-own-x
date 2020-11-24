const mongo = require('mongodb');

const MongoClient = mongo.MongoClient
const url = "mongodb://localhost:27017/"

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("chat-db");

  var myobj = { name: 'Company Inc', address: 'Highway 37' };
  // dbo.createCollection("customers", function(err, res) {
  //   if (err) throw err;
  //   console.log("Collection created");
  //   db.close();
  // })

  // dbo.collection('customers').insertOne(myobj, function(err, res) {
  //   if (err) throw err;
  //   console.log('1 document inserted');
  //   db.close();
  // })

  dbo.collection("customers").findOne({}, function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  })
})