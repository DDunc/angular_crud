var Pirate = require(__dirname + '/../models/pirate');
var express = require('express');
var jsonParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/handle_error');

var piratesRoute = module.exports = exports = express.Router();

piratesRoute.get('/pirates', function(req, res) {
  Pirate.find({}, function(err, data) {
    if (err) return handleError(err, res);
    res.json(data);
  });
});

piratesRoute.post('/pirates', jsonParser, function(req, res) {
  var newPirate = new Pirate(req.body);
  newPirate.save(function(err, data) {
    if (err) handleError(err, res);
    res.json(data);
  });
});

piratesRoute.put('/pirates/:id', jsonParser, function(req, res) {
  var newPirateBody = req.body;
  delete newPirateBody._id;
  Pirate.update({_id: req.params.id}, newPirateBody, function(err, data) {
    if (err) return handleError(err, res);
    res.json({msg: 'success'});
  });
});

piratesRoute.delete('/pirates/:id', function(req, res) {
  Pirate.remove({_id: req.params.id}, function(err) {
    if (err) return handleError(err, res);
    res.json({msg: 'success'});
  });
});
