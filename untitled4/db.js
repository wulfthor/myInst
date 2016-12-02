var mongodb = require('mongodb');
var uri = 'mongodb://localhost:27017/images';

module.exports = function(callback) {
  console.log("db init ..");
  mongodb.MongoClient.connect(uri, callback);
};
