process.env.SLACK_DOMAIN = "your subdomain";
process.env.SLACK_WEBHOOK_TOKEN = "your webhook token";

var sinon = require('sinon');
var expect = require('chai').expect;

var Slack = require('slack-node');

describe("the hack", function() {
  var projName = 'foo-project';
  var hack = require('./index.js')(projName);
  var textIncludes = function(sample) {
    return RegExp(sample).test(get('text'));
  };
  var get = function(attr) {
    return hack.slack.webhook.getCall(0).args[0][attr];
  };
  var sendsWebhook = function(exp) {
    expect(hack.slack.webhook.callCount).to.eq(1);
    var text = get('text');
    expect(/pass/.test(text)).to.eq(!!exp);
    expect(/fail/.test(text)).to.eq(!exp);
  }

  beforeEach(function() {
    sinon.stub(hack.slack, 'webhook');
  });

  afterEach(function() {
    hack.slack.webhook.restore();
  });

  describe("the webhook", function() {
    beforeEach(function() {
      hack.tested(true);
    });

    it("includes project name", function() {
      expect(textIncludes(projName)).to.be.true;
    });

    it("comes from a user named Strider-CD", function() {
      expect(get('username')).to.eq('Strider-CD');
    });

    it("goes to room #general", function() {
      expect(get('channel')).to.eq('#general');
    });
  });

  describe("on test pass", function() {
    beforeEach(function() {
      hack.tested(true);
    });

    it("sends webhook saying it passed", function() {
      sendsWebhook(true);
    });
  });

  describe("on test fail", function() {
    beforeEach(function() {
      hack.tested(false);
    });

    it("sends webhook saying it failed", function() {
      sendsWebhook(false);
    });
  });
});
