var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/pirates_dev');
app.use(express.static(__dirname + '/build'));
var piratesRouter = require(__dirname + '/routes/pirates_routes');
app.use('/api', piratesRouter);
var port = process.env.PORT || 3000;


module.exports = app.listen(port, function() {
  console.log('server up on port: ' + port);
});
