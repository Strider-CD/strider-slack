var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));

var Worker = require('../worker.js');
var schema = require('../schema.js')
var _ = require('lodash');

describe("worker", function() {
  var work = null;
  var io = null;
  var context = null;
  var config = null;
  var job = null;
  var exitCode = null;

  beforeEach(function(done) {
    exitCode = 0;
    job = {
      project: { name: "strider-slack" },
      ref: { },
      _id: "123"
    };
    process.env.strider_server_name = "http://example.com"
    config = {};
    _.each(schema, function(v,k) { config[k] = v.default });
    config.token = 'token';
    config.subdomain = 'subdomain';
    context = {
      comment: sinon.stub()
    };
    io = {
      on: sinon.stub().yields('123', { exitCode: exitCode }),
      removeListener: sinon.stub(),
      emit: sinon.stub()
    };
    Worker.init(config, job, sinon.stub(), function(err, res) {
      expect(context.comment).not.to.have.been.called;
      work = function() { res.listen(io, context) };
      done();
    })
  });

  describe("ref = { branch: 'master' }", function() {
    beforeEach(function() {
      job.ref = { branch: "master" }
      work();
    });
    
    it("creates a link to the commit", function() {
      expect(io.emit).to.have.been.calledWith('plugin.slack.fire', 'token', 'subdomain', {
        channel: '#general',
        username: 'strider-slack',
        icon_url: 'http://media.stridercd.com/img/logo.png',
        text: ':white_check_mark: Tests are passing for master branch :: <http://example.com/strider-slack/job/123|logs>' 
      });
    });
  });

});
