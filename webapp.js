var Slack = require('slack-node');

module.exports = {
  config: require('./schema'),
  listen: function (io, context) {
    io.on('plugin.slack.fire', function(token, subdomain, payload) {
      slack = new Slack(token, subdomain);
      slack.webhook(payload, function(err, response) {
        if (err) console.error(err.message); else console.log(response);
      })
    })
  }
}
