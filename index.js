module.exports = function(projectName) {
  var Slack = require('slack-node');
  var domain = process.env.SLACK_DOMAIN
  var webhookToken = process.env.SLACK_WEBHOOK_TOKEN;
  slack = new Slack(webhookToken, domain);
  var webhook = function(text) {
    slack.webhook({
      channel: "#general",
      username: "Strider-CD",
      text: text
    }, function(err, response) {
      if (err) console.error(err); else console.log(response);
    });
  };

  return {
    slack: slack,
    tested: function(pass) {
      if (pass === true || pass === 0)
        webhook(projectName+" tests passed");
      else
        webhook(projectName+" tests failed");
    }
  }
}
