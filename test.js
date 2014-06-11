process.env.SLACK_DOMAIN = "your subdomain";
process.env.SLACK_WEBHOOK_TOKEN = "your webhook token";

var sinon = require('sinon');
var expect = require('chai').expect;

var Slack = require('slack-node');

describe("the hack", function() {
  var hack = require('./index.js')("foo-project")
  beforeEach(function() {
    sinon.stub(hack.slack, 'webhook');
  });
  afterEach(function() {
    hack.slack.webhook.restore();
  });

  it("says it passed if it tests true", function() {
    hack.tested(true);
    var text = hack.slack.webhook.getCall(0).args[0].text;
    expect(/pass/.test(text)).to.be.true;
    expect(/fail/.test(text)).to.be.false;
  });

  it("says it failed if it tests false", function() {
    hack.tested(false);
    var text = hack.slack.webhook.getCall(0).args[0].text;
    expect(/pass/.test(text)).to.be.false;
    expect(/fail/.test(text)).to.be.true;
  });
});
