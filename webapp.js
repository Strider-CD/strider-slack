var Slack = require('slack-node');

module.exports = {
  config: {
    token: { type: String, default: '' },
    subdomain: { type: String, default: '' },
  },
  listen: function (io, context) {
    io.on('plugin.slack.fire', function(token, subdomain, payload) {
      slack = new Slack(token, subdomain);
      slack.webhook(payload, function(err, response) {
        if (err) console.error(err); else console.log(response);
      })
    })
  }
}
