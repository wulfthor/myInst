var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
  id: String,
  _id: String,
  invNr: String,
  katNr: String,
  fullPath: String,
  color: String,
  size: String
});
console.log("in schema");

module.exports = mongoose.model('Image',imageSchema);
