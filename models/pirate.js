var mongoose = require('mongoose');

var pirateSchema = new mongoose.Schema({
  pirateBody: String,
  favShanty: {type: String, default: "Yo Ho Ho"}
});

module.exports = mongoose.model('Pirate', pirateSchema);
