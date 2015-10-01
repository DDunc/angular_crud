'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
process.env.MONGO_URL = 'mongodb://localhost/pirate_test';
//require(__dirname + '/../server.js');
var server = require(__dirname + '/../../server.js');
var mongoose = require('mongoose');
var url = 'localhost:3000/api';
var pirate = require(__dirname + '/../../models/pirate');

describe('the pirate resource', function() {
  after(function(done) {
    server.close();
    mongoose.connection.db.dropDatabase(function(err) {
      if (err) throw err;
      done();
    });
  });

  it('should be able to get to the pirate path', function(done) {
    chai.request(url)
      .get('/pirate')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  it('should be able to create a pirate', function(done) {
    chai.request(url)
      .post('/pirate')
      .send({stats: [5,5], name: "Bluebeard", favShanty: "99 Bottles of Beer"})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.name).to.eql('Bluebeard');
        done();
      });
  });

  describe('routes that reference an existing pirate record', function() {
    beforeEach(function(done) {
      var testpirate = new pirate({stats: [5,5], name: "Bluebeard", favShanty: "99 Bottles of Beer"});
      testpirate.save(function(err, data) {
        if (err) throw err;
        this.testpirate = data;
        done();
      }.bind(this));
    });

    it('should be able to ask a pirate to sing', function(done) {
      chai.request(url)
        .get('/pirate/' + this.testpirate._id + '/sing')
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql("Bluebeard began singing 99 Bottles of Beer");
          done();
        });
   });

   it('should be able to update a pirate', function(done) {
      chai.request(url)
        .put('/pirate/' + this.testpirate._id)
        .send({name: "Greenbeard"})
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('success');
          done();
        });
   });


   it('should be able to delete a pirate', function(done) {
      chai.request(url)
        .delete('/pirate/' + this.testpirate._id)
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('pirate was deleted');
          done();
        });
   });

  });
});
