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
  var out = null;

  var prepareWorker = function(done) {
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
      work = function() {
        res.listen(io, context);
        return out = io.emit.getCall(0).args[3];
      };
      if (done) done();
    })
  };

  beforeEach(function(done) {
    exitCode = 0;
    job = {
      project: { name: "strider-slack" },
      ref: { branch: "master" },
      _id: "123",
      trigger: { 
        type: "manual"
      }
    };
    process.env.strider_server_name = "http://example.com"
    config = {};
    _.each(schema, function(v,k) { config[k] = v.default });
    config.token = 'token';
    config.subdomain = 'subdomain';
    prepareWorker(done);
  });

  it("emits properly", function() {
    var out = work();
    expect(io.emit).to.have.been.calledWith('plugin.slack.fire', 'token', 'subdomain');
    expect(out.channel).to.eq('#general');
    expect(out.username).to.eq('strider-slack');
    expect(out.icon_url).to.eq('http://media.stridercd.com/img/logo.png');
    expect(out.text.length).to.be.greaterThan(10);
  });

  it("allows changing the channel", function() {
    config.channel = "#builds";
    prepareWorker();
    var out = work();
    expect(out.channel).to.eq('#builds');
  });

  describe("test pass text", function() {
    beforeEach(function() {
      work();
    });

    it("uses the right icon", function() {
      expect(out.text).to.include(":white_check_mark:");
      expect(out.text).not.to.include(":exclamation:");
    });

    it("links happy text to the logs", function() {
      expect(out.text).to.include("<http://example.com/strider-slack/job/123|Tests are passing>");
    });

    it("doesn't say fail", function() {
      expect(out.text).not.to.include("fail");
    });

    describe("manual trigger", function() {
      it("does not try to render a link to an undefined commit", function() {
        expect(out.text).not.to.include("undefined");
      });
    });

    describe("commit trigger", function() {
      var url = "https://github.com/xyz";
      var message = "my commit message";
      beforeEach(function() {
        job.ref.id = 'appears only on commit trigger';
        job.trigger.type = "commit";
        job.trigger.message = message+"\n\n";
        job.trigger.url = url;
        prepareWorker();
      });
      it("links commit message to trigger url", function() {
        expect(work().text).to.include("<"+url+"|"+message+">")
      });
    });
  });


  describe("test fail text", function() {
    beforeEach(function() {
      exitCode = 1;
      prepareWorker();
      work();
    });

    it("uses the right icon", function() {
      expect(out.text).to.include(":exclamation:");
      expect(out.text).not.to.include(":white_check_mark:");
    });

    it("links unhappy text to the logs", function() {
      expect(out.text).to.include("<http://example.com/strider-slack/job/123|Tests are failing>");
    });

    it("doesn't say pass", function() {
      expect(out.text).not.to.include("pass");
    });
  });


  describe("deploy success text", function() {
    beforeEach(function() {
      exitCode = 1;
      prepareWorker();
      work();
    });

    it("uses the right icon", function() {
      expect(out.text).to.include(":exclamation:");
      expect(out.text).not.to.include(":white_check_mark:");
    });

    it("links unhappy text to the logs", function() {
      expect(out.text).to.include("<http://example.com/strider-slack/job/123|Tests are failing>");
    });

    it("doesn't say pass", function() {
      expect(out.text).not.to.include("pass");
    });
  });

  describe("deploy_on_green is true", function() {
    beforeEach(function() {
      job.type = "TEST_AND_DEPLOY";
      prepareWorker();
    });
    it("listens for test and deploy event", function() {
      work();
      expect(io.on).to.have.been.calledTwice;
      expect(io.on.getCall(0).args[0]).to.eq('job.status.tested');
      expect(io.on.getCall(1).args[0]).to.eq('job.status.deployed');
    });
  })
  describe("deploy_on_green is false", function() {
    beforeEach(function() {
      job.type = "TEST_ONLY";
      prepareWorker();
    });
    it("only listens for test event", function() {
      work();
      expect(io.on).to.have.been.calledOnce;
      expect(io.on.getCall(0).args[0]).to.eq('job.status.tested');
    });
  });
});
