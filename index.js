module.exports = {
  phase_done: function(data) {
    if (data.phase === 'test') {
      var Slack = require('slack-node');
      var domain = process.env.SLACK_DOMAIN
      var webhookToken = process.env.SLACK_WEBHOOK_TOKEN;
      slack = new Slack(webhookToken, domain);

      if (data.exitCode === 0) {
        slack.webhook({
          channel: "#general",
          username: "testbot",
          text: "test passed"
        }, function(err, response) {
          if (err) console.error(err); else console.log(response);
        });
      } else {
        slack.webhook({
          channel: "#general",
          username: "testbot",
          text: "test failed"
        }, function(err, response) {
          if (err) console.error(err); else console.log(response);
        });
      }
    }
  }
}
